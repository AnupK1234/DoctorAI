const express = require("express");
const { getSignedUrl } = require("../../controllers/elevenLabController");
const authMiddleware = require("../../middlewares/authMiddleware");
const router = express.Router();

router.get("/get-signed-url", getSignedUrl);

module.exports = router;
