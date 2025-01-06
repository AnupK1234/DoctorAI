const express = require("express");
const {
  imageAnalysis,
  analyzeImageGemini,
} = require("../../controllers/analysisController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/analyze-img", imageAnalysis);
router.post("/analyze-img-gemini", upload.single("file"), analyzeImageGemini);

module.exports = router;
