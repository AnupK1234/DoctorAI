const pdfParse = require("pdf-parse");
const axios = require("axios");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const File = require("../models/File");

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

module.exports = { parseCloudinaryPDF, getAllDocuments };
