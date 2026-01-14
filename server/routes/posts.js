const express = require("express");
const router = express.Router();
const pool = require("../config/dbConfig");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// Get all posts
router.get("/", optionalAuth, async (req, res) => {
  try {
    const query = `
      SELECT 
        posts.id,
        posts.content,
        posts.upvotes,
        posts.downvotes,
        posts.user_id,
        posts.created,
        users.full_name,
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created DESC;
    `;

    const { rows } = await pool.query(query);

    res.json({
      posts: rows,
      count: rows.length
    });
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ error: "Cannot fetch posts" });
  }
});

// Get single post with comments
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    const postQuery = `
      SELECT posts.*, users.full_name
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = $1
    `;

    const commentQuery = `
      SELECT comments.*, users.full_name
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE post_id = $1
      ORDER BY comments.created_at ASC
    `;

    const postResult = await pool.query(postQuery, [postId]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentsResult = await pool.query(commentQuery, [postId]);

    // Get user's vote if authenticated
    let userVote = null;
    if (req.user) {
      const voteQuery = `
        SELECT vote_type
        FROM post_votes
        WHERE post_id = $1 AND user_id = $2
      `;
      const voteResult = await pool.query(voteQuery, [postId, req.user.id]);
      userVote = voteResult.rows.length > 0 ? voteResult.rows[0].vote_type : null;
    }

    res.json({
      post: postResult.rows[0],
      comments: commentsResult.rows,
      userVote
    });
  } catch (err) {
    console.error("Fetch post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new post
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const userID = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Post content is required" });
    }

    const query = `
      INSERT INTO posts(content, user_id)
      VALUES ($1, $2) 
      RETURNING id, content, upvotes, downvotes, user_id, created
    `;

    const result = await pool.query(query, [content, userID]);

    res.status(201).json({
      message: "Post created successfully",
      post: result.rows[0]
    });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Cannot create post" });
  }
});

// Upvote a post
router.post("/:id/upvote", authenticateToken, async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.user.id;

    const existingVoteRes = await pool.query(
      "SELECT vote_type FROM post_votes WHERE user_id=$1 AND post_id=$2",
      [userID, postID]
    );

    if (existingVoteRes.rowCount === 0) {
      // No existing vote - add upvote
      await pool.query(
        "INSERT INTO post_votes(user_id, post_id, vote_type) VALUES ($1, $2, 'upvote')",
        [userID, postID]
      );
      await pool.query("UPDATE posts SET upvotes = upvotes + 1 WHERE id=$1", [postID]);

      return res.json({ message: "Post upvoted", action: "upvoted" });
    }

    const existingVote = existingVoteRes.rows[0].vote_type;

    if (existingVote === "upvote") {
      // Remove upvote
      await pool.query("DELETE FROM post_votes WHERE user_id=$1 AND post_id=$2", [userID, postID]);
      await pool.query("UPDATE posts SET upvotes = upvotes - 1 WHERE id=$1 AND upvotes > 0", [postID]);

      return res.json({ message: "Upvote removed", action: "removed" });
    } else {
      // Change downvote to upvote
      await pool.query(
        "UPDATE post_votes SET vote_type='upvote' WHERE user_id=$1 AND post_id=$2",
        [userID, postID]
      );
      await pool.query(
        "UPDATE posts SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id=$1 AND downvotes > 0",
        [postID]
      );

      return res.json({ message: "Changed to upvote", action: "upvoted" });
    }
  } catch (err) {
    console.error("Upvote error:", err);
    res.status(500).json({ error: "Cannot upvote post" });
  }
});

// Downvote a post
router.post("/:id/downvote", authenticateToken, async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.user.id;

    const existingVoteRes = await pool.query(
      "SELECT vote_type FROM post_votes WHERE user_id=$1 AND post_id=$2",
      [userID, postID]
    );

    if (existingVoteRes.rowCount === 0) {
      // No existing vote - add downvote
      await pool.query(
        "INSERT INTO post_votes(user_id, post_id, vote_type) VALUES ($1, $2, 'downvote')",
        [userID, postID]
      );
      await pool.query("UPDATE posts SET downvotes = downvotes + 1 WHERE id=$1", [postID]);

      return res.json({ message: "Post downvoted", action: "downvoted" });
    }

    const existingVote = existingVoteRes.rows[0].vote_type;

    if (existingVote === "downvote") {
      // Remove downvote
      await pool.query("DELETE FROM post_votes WHERE user_id=$1 AND post_id=$2", [userID, postID]);
      await pool.query("UPDATE posts SET downvotes = downvotes - 1 WHERE id=$1 AND downvotes > 0", [postID]);

      return res.json({ message: "Downvote removed", action: "removed" });
    } else {
      // Change upvote to downvote
      await pool.query(
        "UPDATE post_votes SET vote_type='downvote' WHERE user_id=$1 AND post_id=$2",
        [userID, postID]
      );
      await pool.query(
        "UPDATE posts SET downvotes = downvotes + 1, upvotes = upvotes - 1 WHERE id=$1 AND upvotes > 0",
        [postID]
      );

      return res.json({ message: "Changed to downvote", action: "downvoted" });
    }
  } catch (err) {
    console.error("Downvote error:", err);
    res.status(500).json({ error: "Cannot downvote post" });
  }
});

// Add comment to post
router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.user.id;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const query = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES ($1, $2, $3) 
      RETURNING id, post_id, user_id, content, created_at
    `;

    const result = await pool.query(query, [postID, userID, content]);

    res.status(201).json({
      message: "Comment added successfully",
      comment: result.rows[0]
    });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ error: "Cannot add comment" });
  }
});

// Get comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const postID = req.params.id;

    const query = `
      SELECT comments.*, users.full_name
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE post_id = $1
      ORDER BY comments.created_at ASC
    `;

    const result = await pool.query(query, [postID]);

    res.json({
      comments: result.rows,
      count: result.rows.length
    });
  } catch (err) {
    console.error("Fetch comments error:", err);
    res.status(500).json({ error: "Cannot fetch comments" });
  }
});

module.exports = router;
