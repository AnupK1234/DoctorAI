require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/v1/authRoutes");
const fileRoutes = require("./routes/v1/fileRoutes");

connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/files", fileRoutes);

module.exports = app;
