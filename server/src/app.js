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
const userRoutes = require("./routes/v1/userRoutes");
const User = require("./models/User")

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
app.use("/api/v1/users", userRoutes);
app.post("/docusign-webhook", async (req, res) => {
  try {
    const { event, data } = req.body;

    if (event === "envelope-completed") {
      const envelopeId = data.envelopeId;
      const status = data.envelopeSummary?.status;

      console.log("Received webhook:", { envelopeId, status });

      // Update the database
      const user = await User.findOneAndUpdate(
        { docusignEnvelopeId: envelopeId },
        { documentSigned: status === "completed" },
        { new: true }
      );

      if (user) {
        console.log("User document signing status updated.");
      } else {
        console.log("No user found for the given envelope ID.");
      }
    }

    res.status(200).send("Webhook received and processed.");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Error processing webhook.");
  }
});


module.exports = app;
