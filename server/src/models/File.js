const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    title: { type: String },
    summary: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
