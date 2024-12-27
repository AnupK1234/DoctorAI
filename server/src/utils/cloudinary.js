const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const File = require("../models/File");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer and Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "health_reports",
    allowed_formats: ["pdf", "jpeg", "jpg", "png"],
  },
});

const upload = multer({ storage });

// Controller for file upload
const uploadFile = async (req, res) => {
  try {
    const fileUrl = req?.file?.path;

    if (req?.file?.mimetype.startsWith("image/")) {
      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        imageUrl: fileUrl,
      });
    } else {
      const newFile = await File.create({
        user: req.user.id,
        fileUrl,
      });

      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        file: newFile,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
};

module.exports = { upload, uploadFile, cloudinary };
