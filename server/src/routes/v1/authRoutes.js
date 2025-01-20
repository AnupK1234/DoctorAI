const express = require("express");
const {
  signup,
  login,
  logout,
  verifyOtp,
  resendOtp 
} = require("../../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
