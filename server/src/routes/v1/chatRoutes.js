const express = require("express");
const router = express.Router();
const {
  createConversation,
  addMessage,
  getConversationMessages,
  getUserConversations,
  deleteConversation,
  renameConversation
} = require("../../controllers/chatController");

router.get("/conversations/user/:userId", getUserConversations);
router.post("/conversations", createConversation);
router.post("/messages", addMessage);
router.get("/conversations/:conversationId/messages", getConversationMessages);
router.put("/conversations/rename", renameConversation);
router.delete("/conversations/:conversationId", deleteConversation);

module.exports = router;
