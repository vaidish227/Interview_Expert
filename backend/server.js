const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const fileUpload = require("express-fileupload")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const interviewRoutes = require("./routes/interviews")

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }),
)

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err))
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000, // Wait 20s for server selection
    socketTimeoutMS: 45000,          // Wait 45s for socket response
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/interviews", interviewRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: err.message || "Something went wrong on the server",
    error: process.env.NODE_ENV === "production" ? {} : err,
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


