const axios = require("axios");
const { calculateCost } = require("../misc/costCalculator.js");
const MarketingConversation = require("../models/MarketingConversation.js");
const MarketingMessage = require("../models/MarketingMessage.js");
const Sponsor = require("../models/Sponsor.js");
const { marketingSystemPrompt } = require("../misc/constant.js");
const { stripe } = require("../config/stripe.js");
const { sendPaymentEmail } = require("../emails/templates/index.js");
const { resend } = require("../config/resend.js");

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
    botResponse = `The UNIVERSA Scientific Nodes are advanced AI entities designed for continuous research and innovation across scientific and societal domains. Each node is a dedicated hardware unit equipped with a Large Language Model (LLM), GPU/GLU/TPU, an operating system (Linux), and internet access. They work 24/7/365 to push the boundaries of knowledge and collaborate globally. You can sponsor **Minimum 9** nodes and **Maximum 108,000**, with each node costing **USD $963/month.**`;
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
        : `The total cost for ${numNodes} nodes is USD $${cost}.`;
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
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: marketingSystemPrompt,
          },
          { role: "user", content: content },
        ],
        functions: [
          {
            name: "calculate_cost",
            description:
              "Extract the number of nodes from the user's request and calculate the total cost. The number can be written in digits (e.g., 1000) or words (e.g., 'one thousand two hundred'). It may also include mixed formats (e.g., 'one one two one' for 1121).",
            parameters: {
              type: "object",
              properties: {
                numNodes: {
                  type: "integer",
                  description: "The number of nodes requested.",
                },
              },
              required: ["numNodes"],
            },
          },
        ],
        function_call: "auto",
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    const message = response.data.choices[0].message;

    if (
      message.function_call &&
      message.function_call.name === "calculate_cost"
    ) {
      const { numNodes } = JSON.parse(message.function_call.arguments);
      const cost = calculateCost(numNodes);
      chatbotMsg = new MarketingMessage({
        conversationId,
        sender: null,
        content: `The total cost for **${numNodes} nodes** is **USD $${cost}**.`,
      });
    } else {
      chatbotMsg = new MarketingMessage({
        conversationId,
        sender: null,
        content: message.content,
      });
    }

    await chatbotMsg.save();
  }

  res.json({ chatbotMsg });
};

const createMarketingConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = new MarketingConversation({
      userId,
      title: "Universa Node conversation",
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

const registerForNode = async (req, res) => {
  try {
    const {
      name,
      address,
      email,
      areaOfInterest,
      researchGoals,
      nodes,
      recognition,
      conversationId,
    } = req.body;

    if (!name || !email || !nodes) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (nodes < 9 || nodes > 108000) {
      return res
        .status(400)
        .json({ error: "Invalid node count. Must be between 9 and 108,000." });
    }

    const newSponsor = new Sponsor({
      name,
      address,
      email,
      areaOfInterest,
      researchGoals,
      nodes,
      recognition,
    });
    await newSponsor.save();

    // Stripe Payment Link integration
    const amount = 963 * nodes;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Node subscription",
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://universa-marketing.vercel.app",
      cancel_url: "https://universa-marketing.vercel.app/in",
      customer_email: email,
    });

    await sendPaymentEmail(resend, email, {
      name,
      email,
      stripeLink: session?.url,
    });

    await MarketingConversation.findByIdAndUpdate(conversationId, {
      paymentLink: session.url,
      isConversationOpen: false,
      title: `Closed: ${areaOfInterest}`,
    });

    res.json({
      message: `Signup successful. Payment Link: ${session?.url}. Further details will be shared via email.`,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

const addMessage = async (req, res) => {
  try {
    const { content, sender, conversationId } = req.body;

    await MarketingMessage.create({
      conversationId,
      sender,
      content,
    });

    if (
      content ===
      "Thank you for signing up! Further details will be shared via email to you."
    ) {
      await MarketingConversation.findByIdAndUpdate(conversationId, {
        isNodeRegistered: true,
      });
    }
  } catch (error) {
    console.error("Error adding single message:", error);
    res.status(500).json({ error: "Error adding single message." });
  }
};

module.exports = {
  createMarketingConversation,
  addMarketingMessage,
  getUserMarketingConversations,
  deleteMarketingConversation,
  getMarketingConversationMessages,
  registerForNode,
  addMessage,
};
