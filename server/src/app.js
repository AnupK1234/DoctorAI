require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/v1/authRoutes");
const fileRoutes = require("./routes/v1/fileRoutes");
const elevenRoutes = require("./routes/v1/elevenLabRoutes");
const chatRoutes = require("./routes/v1/chatRoutes");

connectDB();

const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/conversation", elevenRoutes);
app.use("/api/v1/chat", chatRoutes);

module.exports = app;
