const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

require("dotenv").config()

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Catch malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(`❌ JSON Syntax Error: ${err.message}`);
        return res.status(400).json({
            error: "Malformed JSON request",
            details: err.message
        });
    }
    next();
});

app.use(cookieParser())

// Routes
app.use("/api/users", require("./routes/users"))
app.use("/api/posts", require("./routes/posts"))
app.use("/api/jobs", require("./routes/jobs"))

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "HackSync API Server",
        version: "1.0.0",
        status: "running"
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" })
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: "Internal server error" })
})

const PORT = process.env.PORT || 5555
app.listen(PORT, () => console.log(`🚀 API Server running on port ${PORT}`))
