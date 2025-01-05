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
const analysisRoutes = require("./routes/v1/analysisRoute");
const User = require("./models/User")
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
app.use("/api/v1/analysis", analysisRoutes)
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
app.post('/eleven/v1/chat/completions1', async (req, res) => {
  // console.log('Request body:', req.body);
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

app.post('/eleven/v1/chat/completions', async (req, res) => {
  const { messages, model, stream } = req.body;
  

  // Validate the input
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: 'Invalid request. `messages` is required and must be a non-empty array.',
    });
  }

  // Extract the last user message
  const lastMessage = messages[messages.length - 1];

  try {
    
    // Define the prompt for Groq analysis
    const analysisPrompt = `Analyze the following message and determine if it is medical-related. If it is medical-related, return "true". If it is not medical-related, return "false". You should return only a single word either "true" or "false": \n\n"${lastMessage.content}"`;

    // Analyze the last message with Groq SDK
    const groqResponse = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: 'user', content: analysisPrompt }],
    });

    const isMedical = groqResponse.choices[0]?.message?.content;

    console.log("Groq analysis : ", isMedical);

  
    if (isMedical === 'true') {
      if (messages[0]?.role) messages[0].role = 'user';
      const config = {
        method: 'post',
        url: OPENAI_API_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        data: {
          model: model || 'gpt-4',
          messages,
          stream: stream || false,
        },
        responseType: stream ? 'stream' : 'json',
      };
      
      const openAIResponse = await axios(config);
      // console.log("AIII respomsee : ", openAIResponse.data)
      if (stream) {
        // Stream the response back to the client
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        openAIResponse.data.on('data', (chunk) => {
          res.write(chunk);
        });

        openAIResponse.data.on('end', () => {
          res.end();
        });

        openAIResponse.data.on('error', (err) => {
          console.error('Stream error:', err);
          res.status(500).json({ error: 'Streaming failed.' });
        });
      } else {
        // console.log("Inside else");
        
        // Respond with the assistant's reply for non-streaming requests
        res.json(openAIResponse.data);
        // console.log("Openai res : ", openAIResponse.data);
      }
    } 
    else {
      // console.log("NOT MED");
      
      // If the message is non-medical-related, return Groq's response
      const nonMedGroqResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: `Please provide a response to the following user message, ensuring clarity and helpfulness: ${lastMessage.content}`,
            },
          ],
          stream: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          responseType: "stream",
        }
      );

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        nonMedGroqResponse.data.on('data', (chunk) => {
          res.write(chunk);
        });

        nonMedGroqResponse.data.on('end', () => {
          res.end();
        });

        nonMedGroqResponse.data.on('error', (err) => {
          console.error('Stream error:', err);
          res.status(500).json({ error: 'Streaming failed.' });
        });
    }
  } catch (error) {
    console.error('Error processing the request:', error.message);
    res.status(500).json({
      error: 'Failed to process your request. Please try again later.',
    });
  }
});

module.exports = app;
