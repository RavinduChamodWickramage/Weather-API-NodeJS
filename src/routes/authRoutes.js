const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validationMiddleware");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
