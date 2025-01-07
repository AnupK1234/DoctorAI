const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    fileUrl: { 
      type: String, 
      default: null 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);