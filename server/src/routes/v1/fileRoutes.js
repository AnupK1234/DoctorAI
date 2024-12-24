const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const { upload, uploadFile } = require("../../utils/cloudinary");
const { parseCloudinaryPDF, getAllDocuments, updateImgAnalysis } = require("../../controllers/fileController");

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.post("/parse", authMiddleware, parseCloudinaryPDF);
router.post("/img-analysis", authMiddleware, updateImgAnalysis);
router.post("/get-documents", authMiddleware, getAllDocuments);

module.exports = router;
