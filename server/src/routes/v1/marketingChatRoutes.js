const express = require("express");
const router = express.Router();
const {
  createMarketingConversation,
  getUserMarketingConversations,
  deleteMarketingConversation,
  getMarketingConversationMessages,
} = require("../../controllers/marketingChatController");

router.post("/conversations", createMarketingConversation);
router.get("/conversations/user/:userId", getUserMarketingConversations);
router.delete("/conversations/:conversationId", deleteMarketingConversation);
router.get(
  "/conversations/:conversationId/messages",
  getMarketingConversationMessages
);

module.exports = router;
