const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (err) {
    console.error("User fetch error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

