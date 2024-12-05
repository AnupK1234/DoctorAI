const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const { upload, uploadFile } = require("../../utils/cloudinary");

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

module.exports = router;
