const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");

// Middleware to verify JWT token (required authentication)
async function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database with all relevant profile fields
        const result = await pool.query(
            "SELECT id, username, email, phone, location, proficiency_level, preferred_work_mode, availability_timeline, career_goal_short, career_goal_long, onboarding_completed, onboarding_step FROM users WHERE id = $1",
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            res.clearCookie("token");
            return res.status(401).json({ error: "User not found" });
        }

        req.user = result.rows[0];
        next();
    } catch (err) {
        console.error("JWT verification error:", err);
        res.clearCookie("token");
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

// Optional authentication - doesn't fail if no token
async function optionalAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await pool.query(
            "SELECT id, username, email, onboarding_completed FROM users WHERE id = $1",
            [decoded.userId]
        );

        if (result.rows.length > 0) {
            req.user = result.rows[0];
        }
    } catch (err) {
        // Invalid token, just continue without user
        res.clearCookie("token");
    }

    next();
}

module.exports = {
    authenticateToken,
    optionalAuth
};