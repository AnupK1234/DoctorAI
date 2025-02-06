const express = require("express");
const router = express.Router();
const {
  createMarketingConversation,
  getUserMarketingConversations,
  deleteMarketingConversation,
  getMarketingConversationMessages,
  addMarketingMessage,
  registerForNode,
  addMessage
} = require("../../controllers/marketingChatController");

router.post("/conversations", createMarketingConversation);
router.post("/messages", addMarketingMessage);
router.get("/conversations/user/:userId", getUserMarketingConversations);
router.delete("/conversations/:conversationId", deleteMarketingConversation);
router.get(
  "/conversations/:conversationId/messages",
  getMarketingConversationMessages
);
router.post("/register-node-request", registerForNode);
router.post("/add-single-message", addMessage);



module.exports = router;
