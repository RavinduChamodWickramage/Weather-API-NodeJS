const express = require("express");
const { updateUserLocation } = require("../controllers/userController");
const {
  updateLocationValidation,
} = require("../middlewares/validationMiddleware");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.put("/location", protect, updateLocationValidation, updateUserLocation);

module.exports = router;
