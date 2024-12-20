require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const axios = require('axios');
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

const OPENAI_API_URL = process.env.OPENAI_API_URL;
app.post('/eleven/v1/chat/completions', async (req, res) => {
  console.log('Request body:', req.body);
  const { messages, model, stream } = req.body;

  if (messages[0]?.role) messages[0].role = 'user';
  // Validate the input
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error:
        'Invalid request. `messages` is required and must be a non-empty array.',
    });
  }

  try {
    // Set up Axios request configuration
    const config = {
      method: 'post',
      url: OPENAI_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        model: model || 'gpt-4', // Default to gpt-4 if no model is specified
        messages,
        stream: stream || false, // Pass stream parameter to the API
      },
      responseType: stream ? 'stream' : 'json', // Handle streaming response if stream is true
    };

    const response = await axios(config);

    if (stream) {
      // Stream the response back to the client
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      response.data.on('data', (chunk) => {
        res.write(chunk);
      });

      response.data.on('end', () => {
        res.end();
      });

      response.data.on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).json({ error: 'Streaming failed.' });
      });
    } else {
      // Respond with the assistant's reply for non-streaming requests
      const reply = response.data.choices[0]?.message?.content;
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error interacting with OpenAI:', error.message);
    res.status(500).json({
      error: 'Failed to process your request. Please try again later.',
    });
  }
});

module.exports = app;
