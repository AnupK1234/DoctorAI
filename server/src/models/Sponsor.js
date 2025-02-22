const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  country: { type: String },
  email: { type: String, required: true },
  areaOfInterest: { type: String },
  researchGoals: { type: String },
  nodes: { type: Number, required: true, min: 9, max: 108000 },
  recognition: { type: String, enum: ["Yes", "No"], default: "Yes" },
  createdAt: { type: Date, default: Date.now },
  documentSigned: { type: Boolean, default: false },
  docusignEnvelopeId: { type: String },
});

module.exports = mongoose.model("Sponsor", sponsorSchema);
