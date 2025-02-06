const axios = require("axios");
const { calculateCost } = require("../misc/costCalculator.js");
const MarketingConversation = require("../models/MarketingConversation.js");
const MarketingMessage = require("../models/MarketingMessage.js");
const { marketingSystemPrompt } = require("../misc/constant.js");

const addMarketingMessage = async (req, res) => {
  const { content, sender, conversationId } = req.body;
  if (!content) return res.status(400).json({ error: "Message is required" });

  let botResponse = "";
  let chatbotMsg;

  await MarketingMessage.create({
    conversationId,
    sender,
    content,
  });

  // "Learn about nodes" case
  if (content.toLowerCase().includes("learn about nodes")) {
    botResponse = `The UNIVERSA Scientific Nodes are advanced AI entities designed for continuous research and innovation across scientific and societal domains. Each node is a dedicated hardware unit equipped with a Large Language Model (LLM), GPU/GLU/TPU, an operating system (Linux), and internet access. They work 24/7/365 to push the boundaries of knowledge and collaborate globally. You can sponsor **Minimum 9** nodes and **Maximum 108,000**, with each node costing **$963/month**`;
    chatbotMsg = new MarketingMessage({
      conversationId,
      sender: null,
      content: botResponse,
    });

    await chatbotMsg.save();
  } else if (content.toLowerCase().includes("ask a question")) {
    botResponse = `Feel free to ask any question you have regarding nodes?`;
    chatbotMsg = new MarketingMessage({
      conversationId,
      sender: null,
      content: botResponse,
    });

    await chatbotMsg.save();
  } else if (content.toLowerCase().includes("calculate costs")) {
    botResponse =
      "Please enter the number of nodes you'd like to calculate the cost for.";
    chatbotMsg = new MarketingMessage({
      conversationId,
      sender: null,
      content: botResponse,
    });

    await chatbotMsg.save();
  } else if (!isNaN(content)) {
    const numNodes = parseInt(content, 10);
    const cost = calculateCost(numNodes);
    botResponse =
      numNodes > 108000 || numNodes < 9
        ? `The minimum node allowed are 9 and maximum are 108000`
        : `The total cost for ${numNodes} nodes is $${cost}.`;
    chatbotMsg = new MarketingMessage({
      conversationId,
      sender: null,
      content: botResponse,
    });

    await chatbotMsg.save();
  } else {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: marketingSystemPrompt,
          },
          { role: "user", content: content },
        ],
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );
    chatbotMsg = {
      sender: null,
      content: response.data.choices[0].message.content,
    };
  }

  // Save chat conversation to MongoDB
  // try {
  //   await Chat.create({ userMessage, botResponse });
  // } catch (error) {
  //   console.error("Error saving chat:", error);
  // }

  res.json({ chatbotMsg });
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
  addMarketingMessage,
  getUserMarketingConversations,
  deleteMarketingConversation,
  getMarketingConversationMessages,
};
