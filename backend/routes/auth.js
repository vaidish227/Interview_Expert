const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { check, validationResult } = require("express-validator")

const router = express.Router()

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      // Check if user already exists
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ message: "User already exists with this email" })
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
      })

      // Save user (password will be hashed by pre-save hook)
      await user.save()

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
        if (err) throw err
        res.status(201).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        })
      })
    } catch (err) {
      console.error("Registration error:", err.message)
      res.status(500).json({ message: "Server error during registration" })
    }
  },
)

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // Check if user exists
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Check password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
        if (err) throw err
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        })
      })
    } catch (err) {
      console.error("Login error:", err.message)
      res.status(500).json({ message: "Server error during login" })
    }
  },
)

module.exports = router

