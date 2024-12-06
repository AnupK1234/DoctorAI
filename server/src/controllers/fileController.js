const pdfParse = require("pdf-parse");
const axios = require("axios");

const parseCloudinaryPDF = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    // Fetch the PDF from Cloudinary
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });
    const pdfBuffer = Buffer.from(response.data, "binary");

    // Parse the PDF using pdf-parse
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    // console.log("PDF text is : ", pdfText);
    

    // Store the extracted text
    // return pdfText;

  } catch (error) {
    console.error("Error parsing PDF:", error);
    return null;
  }
};

module.exports = { parseCloudinaryPDF };
