const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signToken, verifyToken } = require("../utils/jwtUtils");

const signup = async (req, res) => {
  try {
    const { email, password, name, referral } = req.body;
    const user = await User.create({ email, password, name, referralCode: referral });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, email, name },
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    const userObject = { _id: user._id, name: user.name, email: user.email };

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email, name: user.name },
      cookie: { token, userObject },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("userObject");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { signup, login, logout };
