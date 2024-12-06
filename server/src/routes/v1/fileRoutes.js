const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const { upload, uploadFile } = require("../../utils/cloudinary");
const { parseCloudinaryPDF } = require("../../controllers/fileController");

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.post("/parse", authMiddleware, parseCloudinaryPDF);

module.exports = router;
