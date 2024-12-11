const mongoose = require("mongoose");
const Message = require("./Message")

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
  },
  { timestamps: true }
);

// Pre-remove hook to delete associated messages
conversationSchema.pre("findOneAndDelete", async function (next) {
  const conversationId = this.getQuery()["_id"];
  try {
    await Message.deleteMany({ conversationId });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Conversation", conversationSchema);