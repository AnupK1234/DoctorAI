const axios = require("axios");
const { calculateCost } = require("../misc/costCalculator.js");
const MarketingConversation = require("../models/MarketingConversation.js");
const MarketingMessage = require("../models/MarketingMessage.js");

const chatWithBot = async (req, res) => {
  const { userMessage } = req.body;
  if (!userMessage)
    return res.status(400).json({ error: "Message is required" });

  let botResponse = "";

  if (userMessage.toLowerCase().includes("learn about nodes")) {
    botResponse =
      "The UNIVERSA Scientific Nodes are AI-driven entities designed for research in scientific and societal domains...";
  } else if (userMessage.toLowerCase().includes("calculate costs")) {
    botResponse =
      "Please enter the number of nodes you'd like to calculate the cost for.";
  } else if (!isNaN(userMessage)) {
    const numNodes = parseInt(userMessage, 10);
    const cost = calculateCost(numNodes);
    botResponse = `The total cost for ${numNodes} nodes is $${cost}.`;
  } else {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      }
    );
    botResponse = response.data.choices[0].message.content;
  }

  // Save chat conversation to MongoDB
  try {
    await Chat.create({ userMessage, botResponse });
  } catch (error) {
    console.error("Error saving chat:", error);
  }

  res.json({ botResponse });
};

const createMarketingConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = new MarketingConversation({
      userId,
      title: "Untitled Conversation",
    });
    await conversation.save();
    const botMessage = new MarketingMessage({
      conversationId: conversation._id,
      sender: null, // null sender implies AI chatbot
      content: "Welcome to UNIVERSA Earth Atlas! How can I assist you today?",
    });
    await botMessage.save();

    res.status(201).json({ conversation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserMarketingConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await MarketingConversation.find({ userId }).sort({
      updatedAt: -1,
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMarketingConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    console.log("DSFAASFS : ", conversationId);

    const deletedConversation = await MarketingConversation.findOneAndDelete({
      _id: conversationId,
    });
    if (!deletedConversation)
      return res.status(404).json({ error: "Conversation not found" });
    res
      .status(200)
      .json({ message: "Conversation and its messages deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMarketingConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await MarketingMessage.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createMarketingConversation,
  chatWithBot,
  getUserMarketingConversations,
  deleteMarketingConversation,
  getMarketingConversationMessages,
};
