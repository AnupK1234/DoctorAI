const mongoose = require("mongoose");
const MarketingMessage = require("./MarketingMessage");

const marketingConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "Untitled Conversation" },
  },
  { timestamps: true }
);

// Pre-remove hook to delete associated messages
marketingConversationSchema.pre("findOneAndDelete", async function (next) {
  const conversationId = this.getQuery()["_id"];
  try {
    await MarketingMessage.deleteMany({ conversationId });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model(
  "MarketingConversation",
  marketingConversationSchema
);
