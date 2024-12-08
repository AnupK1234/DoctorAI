const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signToken, verifyToken } = require("../utils/jwtUtils");

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-20 characters long and include at least one letter, one number, and one special character",
      });
    }

    const user = await User.create({ email, password, name });

    const token = signToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

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
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 3600000), // 24hr expiry
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    const userObject = { _id: user._id, name: user.name, email: user.email };
    res.cookie("userObject", JSON.stringify(userObject) , {
      expires: new Date(Date.now() + 24 * 3600000), // 24hr expiry
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email, name: user.name },
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

const validateToken = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    const { id } = decoded;
    const user = await User.findOne({ _id: id }).select("_id name email");
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { signup, login, logout, validateToken };
