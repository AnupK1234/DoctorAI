const express = require("express");
const {
  getSignedUrl,
  huggingFaceMode,
} = require("../../controllers/elevenLabController");
const authMiddleware = require("../../middlewares/authMiddleware");
const router = express.Router();

router.get("/get-signed-url", getSignedUrl);
router.post("/v1/chat/completions", huggingFaceMode);

module.exports = router;
