const express = require("express");
const { imageAnalysis } = require("../../controllers/analysisController");

const router = express.Router();

router.post("/analyze-img", imageAnalysis);

module.exports = router;