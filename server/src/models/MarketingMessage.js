const mongoose = require("mongoose");

const marketingMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketingConversation",
      required: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketingMessage", marketingMessageSchema);
