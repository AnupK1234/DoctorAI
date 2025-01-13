const mongoose = require("mongoose");

const avatarConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversation_id: {
      type: String,
      required: true
    },
    conversation_transcript: [
      {
        role: {
          type: String,
          enum: ["user", "agent"],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AvatarConversation", avatarConversationSchema);
