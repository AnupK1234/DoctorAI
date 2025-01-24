const express = require("express");
const router = express.Router();
const {
  createConversation,
  addMessage,
  getConversationMessages,
  getUserConversations,
  deleteConversation,
  renameConversation,
  chatImgAnalysis,
  chatPdfAnalysis,
  generateQuestions,
  analyzeQuestionare
} = require("../../controllers/chatController");
const multer = require("multer");
const upload1 = multer({ storage: multer.memoryStorage() });
const { upload, uploadFile } = require("../../utils/cloudinary");
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/conversations/user/:userId", getUserConversations);
router.post("/conversations", createConversation);
router.post("/conversations/analyze-questionare", authMiddleware, analyzeQuestionare);
router.post("/messages", addMessage);
router.get("/conversations/:conversationId/messages", getConversationMessages);
router.put("/conversations/rename", renameConversation);
router.delete("/conversations/:conversationId", deleteConversation);
router.post("/img-analysis", authMiddleware, upload.single("file"), chatImgAnalysis);
router.post("/pdf-analysis", authMiddleware, upload.single("file"), chatPdfAnalysis);
router.post("/generate-questions", authMiddleware, generateQuestions)

module.exports = router;
