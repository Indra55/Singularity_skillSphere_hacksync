const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");
const { authenticateToken } = require("../middleware/auth");

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please provide username, email, and password" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict"
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        onboarding_completed: user.onboarding_completed
      },
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

// Get current user profile
router.get("/me", authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

// Update user profile
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const { username, phone, location, proficiency_level, preferred_work_mode, availability_timeline, career_goal_short, career_goal_long } = req.body;

    const result = await pool.query(
      `UPDATE users SET 
        username = COALESCE($1, username),
        phone = COALESCE($2, phone),
        location = COALESCE($3, location),
        proficiency_level = COALESCE($4, proficiency_level),
        preferred_work_mode = COALESCE($5, preferred_work_mode),
        availability_timeline = COALESCE($6, availability_timeline),
        career_goal_short = COALESCE($7, career_goal_short),
        career_goal_long = COALESCE($8, career_goal_long),
        updated_at = now()
      WHERE id = $9 RETURNING id, username, email, phone, location, proficiency_level, preferred_work_mode, availability_timeline, career_goal_short, career_goal_long`,
      [username, phone, location, proficiency_level, preferred_work_mode, availability_timeline, career_goal_short, career_goal_long, req.user.id]
    );

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "An error occurred while updating profile" });
  }
});

module.exports = router;
