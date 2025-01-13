const axios = require("axios");
const AvatarConversation = require("../models/AvatarConversation");

const getSignedUrl = async (req, res) => {
  try {
    const agentId = process.env.PUBLIC_AGENT_ID;
    const apiKey = process.env.XI_API_KEY;

    if (!agentId || !apiKey) {
      return res
        .status(400)
        .json({ error: "Missing required environment variables" });
    }

    const response = await axios.get(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to get signed URL");
    }

    res.json({ signedUrl: response.data.signed_url });
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Failed to generate signed URL";
    res.status(500).json({ error: errorMessage });
  }
};

const OPENAI_API_URL = process.env.OPENAI_API_URL;

const huggingFaceMode = async (req, res) => {
  console.log("Request body:", req.body);
  const { messages, model, stream } = req.body;

  if (messages[0]?.role) messages[0].role = "user";
  // Validate the input
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error:
        "Invalid request. `messages` is required and must be a non-empty array.",
    });
  }

  try {
    // Set up Axios request configuration
    const config = {
      method: "post",
      url: OPENAI_API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        model: model || "gpt-4", // Default to gpt-4 if no model is specified
        messages,
        stream: stream || false, // Pass stream parameter to the API
      },
      responseType: stream ? "stream" : "json", // Handle streaming response if stream is true
    };

    const response = await axios(config);

    if (stream) {
      // Stream the response back to the client
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      response.data.on("data", (chunk) => {
        res.write(chunk);
      });

      response.data.on("end", () => {
        res.end();
      });

      response.data.on("error", (err) => {
        console.error("Stream error:", err);
        res.status(500).json({ error: "Streaming failed." });
      });
    } else {
      // Respond with the assistant's reply for non-streaming requests
      const reply = response.data.choices[0]?.message?.content;
      res.json(response.data);
    }
  } catch (error) {
    console.error("Error interacting with OpenAI:", error.message);
    res.status(500).json({
      error: "Failed to process your request. Please try again later.",
    });
  }
};

const saveAvatarConversation = async (req, res) => {
  const { conversation_id } = req.body;

  try {
    const conversationData = await axios.get(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversation_id}`,
      {
        headers: {
          "xi-api-key": process.env.XI_API_KEY,
        },
      }
    ); 

    const conversation_transcript = conversationData?.data?.transcript.map(
      (item) => ({
        role: item.role,
        message: item.message,
      })
    );

    const newConversation = new AvatarConversation({
      userId: req.user.id,
      conversation_id,
      conversation_transcript: conversation_transcript,
    });

    await newConversation.save();

    return res.status(201).json({
      success: true,
      message: "Conversation saved successfully",
      data: newConversation,
    });
  } catch (error) {
    console.error("Error saving conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving conversation",
      error: error.message,
    });
  }
};

module.exports = { getSignedUrl, huggingFaceMode, saveAvatarConversation };
