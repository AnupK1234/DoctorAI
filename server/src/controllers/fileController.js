const pdfParse = require("pdf-parse");
const axios = require("axios");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const File = require("../models/File");
const { cloudinary } = require("../utils/cloudinary");

const parseCloudinaryPDF = async (req, res) => {
  try {
    const { fileUrl, _id } = req.body.file;

    // Fetch the PDF from Cloudinary
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });
    const pdfBuffer = Buffer.from(response.data, "binary");

    // Parse the PDF using pdf-parse
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;
    // console.log("PDF text is : ", pdfText);

    const prompt = `
Analyze the following medical text and generate a suitable title and a concise summary:
Text:
${pdfText}

Response format:
{
  "title": "<Generated Title>",
  "summary": "<Generated Summary>"
}
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    if (
      !completion ||
      !completion.choices ||
      !completion.choices.length ||
      !completion.choices[0].message
    ) {
      throw new Error("Failed to generate title and summary from Groq.");
    }

    const responseText = completion.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Groq response.");
    }

    const parsedResponse = JSON.parse(jsonMatch);
    const { title, summary } = parsedResponse;

    // console.log("Title : ", title)
    // console.log("Summary : ", summary)

    const updateRes = await File.findOneAndUpdate(
      { _id },
      { title, summary },
      { new: true }
    );

    res.status(201).send(updateRes);
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return null;
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const { id } = req.user;

    const documents = await File.find({ user: id });

    res.status(201).send(documents);
  } catch (error) {
    console.log("Error fetching documents : ", error);
  }
};

const updateImgAnalysis = async (req, res) => {
  try {
    const { fileData, analyzeRes } = req.body;

    let document;

    if (!fileData || !fileData._id) {
      document = await File.create({
        title: analyzeRes.data.result.substring(0, 50),
        imgAnalysis: analyzeRes.data.result,
        user: req.user.id
      });
    } else {
      document = await File.findOneAndUpdate(
        { _id: fileData._id },
        { imgAnalysis: analyzeRes.data.result },
        { new: true }
      );
    }

    res.status(201).send(document);
  } catch (error) {
    console.log("Error fetching or creating documents: ", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing the request" });
  }
};


const deleteDocById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await File.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Extract the public_id from the Cloudinary URL
    const cloudinaryUrl = document.fileUrl;
    const fileNameWithExtension = cloudinaryUrl.split("/").pop();
    const fileName = fileNameWithExtension.split(".")[0];
    const publicId = `health_reports/${fileName}`;

    // Delete the file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      console.error("Cloudinary deletion error:", result);
      return res
        .status(500)
        .json({ message: "Failed to delete file from Cloudinary" });
    }

    await File.findByIdAndDelete(id);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};

module.exports = {
  parseCloudinaryPDF,
  getAllDocuments,
  updateImgAnalysis,
  deleteDocById,
};
