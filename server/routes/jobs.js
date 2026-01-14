const express = require("express");
const router = express.Router();
const axios = require("axios");
const { authenticateToken } = require("../middleware/auth");

// Mock data for fallback
const mockJobs = [
    {
        id: "1",
        title: "Senior Software Engineer - AI/ML",
        company: "TechCorp",
        location: "San Francisco, CA",
        salary: "$180K - $220K",
        match: 94,
        posted: "2 hours ago",
        type: "new",
        description: "Looking for an experienced engineer to build AI-powered features for our core platform using Python and TensorFlow.",
        url: "https://www.linkedin.com/jobs/view/123456789"
    },
    {
        id: "2",
        title: "Full-Stack Developer",
        company: "StartupXYZ",
        location: "New York, NY",
        salary: "$140K - $170K",
        match: 87,
        posted: "5 hours ago",
        type: "recommended",
        description: "Join our fast-growing team to build the next generation platform using React, Node.js, and PostgreSQL.",
        url: "https://www.linkedin.com/jobs/view/987654321"
    },
    {
        id: "3",
        title: "Tech Lead - Infrastructure",
        company: "CloudScale",
        location: "Remote",
        salary: "$200K - $250K",
        match: 91,
        posted: "1 day ago",
        type: "updated",
        description: "Lead infrastructure initiatives for our cloud-native platform. Kubernetes and AWS experience required.",
        url: "https://www.linkedin.com/jobs/view/456789123"
    },
    {
        id: "4",
        title: "Product Manager - Developer Tools",
        company: "DevTools Inc",
        location: "Seattle, WA",
        salary: "$150K - $190K",
        match: 82,
        posted: "2 days ago",
        type: "recommended",
        description: "Shape the future of developer experience with cutting-edge tools. Technical background preferred.",
        url: "https://www.linkedin.com/jobs/view/789123456"
    },
    {
        id: "5",
        title: "Data Scientist",
        company: "DataMinds",
        location: "Boston, MA",
        salary: "$160K - $190K",
        match: 89,
        posted: "3 days ago",
        type: "new",
        description: "Analyze large datasets to derive actionable insights and build predictive models.",
        url: "https://www.linkedin.com/jobs/view/321654987"
    }
];

// POST /api/jobs/linkedin - Fetch jobs based on user profile
router.post("/linkedin", authenticateToken, async (req, res) => {
    try {
        // Debug logging
        console.log("POST /api/jobs/linkedin hit");
        console.log("User from auth middleware:", req.user ? `ID: ${req.user.id}` : "No user");

        if (!req.user) {
            return res.status(401).json({ error: "User context missing" });
        }

        const { career_goal_short, location } = req.user;
        console.log(`Searching for: ${career_goal_short} in ${location}`);

        // Check for API key
        const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
        const RAPIDAPI_HOST = 'linkedin-job-search-api.p.rapidapi.com';

        console.log(`API Key present: ${!!RAPIDAPI_KEY}`);
        console.log(`API Host: ${RAPIDAPI_HOST}`);

        if (RAPIDAPI_KEY) {
            const options = {
                method: 'GET',
                url: `https://${RAPIDAPI_HOST}/search`,
                params: {
                    keywords: career_goal_short || 'Software Engineer',
                    location: location || 'United States',
                    limit: '10',
                    sort: 'r' // Relevance
                },
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                }
            };

            try {
                console.log("Sending request to RapidAPI with options:", JSON.stringify(options, (key, value) => {
                    if (key === 'x-rapidapi-key') return 'HIDDEN';
                    return value;
                }, 2));

                const response = await axios.request(options);

                console.log("RapidAPI Response Status:", response.status);
                console.log("RapidAPI Response Data Type:", typeof response.data);

                // Fantastic Jobs API typically returns data in response.data or response.data.data
                const rawJobs = response.data.data || response.data || [];
                console.log(`Raw jobs found: ${Array.isArray(rawJobs) ? rawJobs.length : 'Not an array'}`);

                const jobs = Array.isArray(rawJobs) ? rawJobs.map(job => ({
                    id: job.id || Math.random().toString(36).substr(2, 9),
                    title: job.title || "Untitled Job",
                    company: job.company?.name || job.company || "Unknown Company",
                    location: job.location || "Remote",
                    salary: "See listing",
                    match: Math.floor(Math.random() * (99 - 70) + 70),
                    posted: job.postDate || "Recently",
                    type: "new",
                    description: "Click View on LinkedIn for full details.",
                    url: job.url || job.linkedinJobUrl
                })) : [];

                if (jobs.length === 0) {
                    console.warn("API returned no jobs. Response structure might be unexpected:", JSON.stringify(response.data).substring(0, 200));
                    return res.json({ jobs: mockJobs });
                }

                console.log(`Returning ${jobs.length} valid jobs to client`);
                return res.json({ jobs });
            } catch (apiError) {
                console.error("RapidAPI Request Failed.");
                console.error("Error Message:", apiError.message);
                if (apiError.response) {
                    console.error("API Error Status:", apiError.response.status);
                    console.error("API Error Data:", JSON.stringify(apiError.response.data));
                }
                return res.json({ jobs: mockJobs });
            }

        } else {
            console.log("Using mock data (No API key found)");
            return res.json({ jobs: mockJobs });
        }

    } catch (error) {
        console.error("CRITICAL SERVER ERROR in /linkedin:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

module.exports = router;
