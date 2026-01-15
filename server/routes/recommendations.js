const express = require("express");
const router = express.Router();
const pool = require("../config/dbConfig");
const { authenticateToken } = require("../middleware/auth");

/**
 * @route GET /api/recommendations/career
 * @desc Get career recommendations based on user profile
 * @access Private
 */
router.get("/career", authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // 1. Fetch user profile data
        const userResult = await pool.query(
            "SELECT proficiency_level, career_goal_short, preferred_work_mode FROM users WHERE id = $1",
            [userId]
        );
        const user = userResult.rows[0];

        // 2. Fetch skills
        const skillsResult = await pool.query(
            "SELECT skill_name, proficiency FROM skills WHERE user_id = $1",
            [userId]
        );
        const skills = skillsResult.rows;

        // 3. Fetch experience count
        const expResult = await pool.query(
            "SELECT COUNT(*) as exp_count FROM experience WHERE user_id = $1",
            [userId]
        );
        const expCount = parseInt(expResult.rows[0].exp_count);

        // 4. Fetch preferences
        const prefResult = await pool.query(
            "SELECT preferred_roles, industry_preferences FROM preferences WHERE user_id = $1",
            [userId]
        );
        const preferences = prefResult.rows[0] || { preferred_roles: [], industry_preferences: [] };

        /**
         * Career Recommendation Logic (Mocked for this stage)
         * Requirements:
         * - Use user profile data, skills, experience count, preferences
         * - Work even if resume was never uploaded
         * - Work even if extended profile is empty
         */

        const recommendations = [];

        // Heuristic 1: Based on Career Goal
        if (user && user.career_goal_short) {
            recommendations.push({
                title: `Senior ${user.career_goal_short}`,
                reason: `Aligns with your stated goal of becoming a ${user.career_goal_short}`,
                match_score: 95
            });
        }

        // Heuristic 2: Based on Skills
        if (skills && skills.length > 0) {
            const topSkills = skills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 2);
            topSkills.forEach(skill => {
                recommendations.push({
                    title: `${skill.skill_name} Specialist`,
                    reason: `Leverages your proficiency in ${skill.skill_name}`,
                    match_score: 85
                });
            });
        }

        // Heuristic 3: Based on Preferences
        if (preferences.preferred_roles && preferences.preferred_roles.length > 0) {
            preferences.preferred_roles.forEach(role => {
                recommendations.push({
                    title: role,
                    reason: "Matches one of your preferred roles",
                    match_score: 90
                });
            });
        }

        // Heuristic 4: Based on Experience Count
        if (expCount > 5) {
            recommendations.push({
                title: "Technical Lead / Manager",
                reason: "Your extensive experience makes you a candidate for leadership roles",
                match_score: 80
            });
        } else if (expCount > 0 && expCount <= 2) {
            recommendations.push({
                title: "Junior Developer / Associate",
                reason: "Great starting point for your early career stage",
                match_score: 80
            });
        }

        // Fallback if no data is available
        if (recommendations.length === 0) {
            recommendations.push({
                title: "Software Engineer (General)",
                reason: "A versatile starting point for most technical careers",
                match_score: 60
            });
            recommendations.push({
                title: "Product Coordinator",
                reason: "Good entry-level role for career exploration",
                match_score: 55
            });
        }

        // Remove duplicates and limit results
        const uniqueRecommendations = Array.from(new Set(recommendations.map(r => r.title)))
            .map(title => recommendations.find(r => r.title === title))
            .sort((a, b) => b.match_score - a.match_score)
            .slice(0, 5);

        res.json({
            user_id: userId,
            recommendations: uniqueRecommendations
        });

    } catch (err) {
        console.error("Recommendations error:", err);
        res.status(500).json({ error: "Failed to generate career recommendations" });
    }
});

module.exports = router;
