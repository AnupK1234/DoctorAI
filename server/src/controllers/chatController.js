const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const askAI = async (conversationHistory, input) => {
  const messages = conversationHistory.map((msg) => ({ role: msg.sender ? "user" : "assistant", content: msg.content }));
  messages.unshift({
    role: "system",
    content: 
      "You are a highly knowledgeable and empathetic health expert. Your role is to provide accurate, concise, and professional guidance on a wide range of health topics, including physical health, mental health, nutrition, fitness, preventive care, and common medical conditions. You are designed to assist users with general health concerns, clarify medical concepts, and offer practical advice while ensuring the information is evidence-based and easy to understand. Always prioritize safety, and encourage consulting a qualified healthcare provider for severe or critical issues. You are not a substitute for professional medical care but a helpful guide for health-related queries. Respond thoughtfully, maintaining clarity, empathy, and professionalism. Avoid giving advice on topics outside of mental health. Always respond in 2-3 sentences.",
  });

  messages.push({ role: "user", content: input });

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages,
  });

  return response.choices[0].message.content;
};

const generateTitle = async (messages) => {
  const lastMessage = messages[messages.length - 1]?.content || "Chat";
  const titleResponse = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: "Generate a concise and relevant title for this conversation." },
      { role: "user", content: lastMessage },
    ],
  });
  return titleResponse.choices[0].message.content || "Untitled Conversation";
};

const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = new Conversation({ userId, title: "Untitled Conversation" });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;

    const conversationHistory = await Message.find({ conversationId }).sort({ createdAt: 1 });

    const response = await askAI(conversationHistory, content);

    const userMessage = new Message({ conversationId, sender, content });
    await userMessage.save();

    const botMessage = new Message({
      conversationId,
      sender: null, // null sender implies AI chatbot
      content: response,
    });
    await botMessage.save();

    // Update conversation title if this is the first message
    const conversation = await Conversation.findById(conversationId);
    if (conversation && !conversation.title) {
      const allMessages = await Message.find({ conversationId }).sort({ createdAt: 1 });
      conversation.title = await generateTitle(allMessages);
      await conversation.save();
    }

    res.status(201).json({ userMessage, botMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const renameConversation = async (req, res) => {
  try {
    const { conversationId, newTitle } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { title: newTitle },
      { new: true }
    );
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const deletedConversation = await Conversation.findOneAndDelete({ _id: conversationId });
    if (!deletedConversation) return res.status(404).json({ error: "Conversation not found" });
    res.status(200).json({ message: "Conversation and its messages deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createConversation, addMessage, getConversationMessages, getUserConversations, deleteConversation, renameConversation };
