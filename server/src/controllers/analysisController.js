const OpenAI = require("openai");
const openai = new OpenAI();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const imageAnalysis = async (req, res) => {

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert radiologist specializing in advanced medical imaging analysis. Your core competencies include:
                    - Detailed interpretation of X-rays, CT scans, MRI, PET scans, ultrasound, and nuclear medicine imaging
                    - Recognition of subtle pathological patterns and anatomical variations
                    - Systematic review methodology following ACR reporting guidelines
                    - Expertise in both common and rare radiological findings
                    - Advanced understanding of imaging artifacts and technical quality assessment

                    For each image analysis:
                    1. Systematically evaluate technical quality and positioning
                    2. Apply structured reporting frameworks
                    3. Document all findings with precise anatomical localization
                    4. Note both primary findings and incidental observations
                    5. Compare with prior studies when available
                    6. Consider clinical context in interpretation
    
                    Maintain strict adherence to radiation safety principles and ALARA guidelines while providing comprehensive, accurate interpretations.`,
            },
            {
              type: "image_url",
              image_url: {
                url: "https://res.cloudinary.com/dqmho7egs/image/upload/v1736001782/health_reports/ingime0mwbs7q02qdvlj.jpg",
              },
            },
          ],
        },
      ],
    });

    console.log(response.choices[0]);
  } catch (error) {
    console.log("Error while anlyzing image : ", error);
  }
};

const analyzeImageGemini = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    // console.log("File : ", req.file);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create image part from buffer
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `You are an expert radiologist specializing in advanced medical imaging analysis. Your core competencies include:
                    - Detailed interpretation of X-rays, CT scans, MRI, PET scans, ultrasound, and nuclear medicine imaging
                    - Recognition of subtle pathological patterns and anatomical variations
                    - Systematic review methodology following ACR reporting guidelines
                    - Expertise in both common and rare radiological findings
                    - Advanced understanding of imaging artifacts and technical quality assessment

                    For each image analysis:
                    1. Systematically evaluate technical quality and positioning
                    2. Apply structured reporting frameworks
                    3. Document all findings with precise anatomical localization
                    4. Note both primary findings and incidental observations
                    5. Compare with prior studies when available
                    6. Consider clinical context in interpretation
    
                    Maintain strict adherence to radiation safety principles and ALARA guidelines while providing comprehensive, accurate interpretations.`;

    const response = await model.generateContent([prompt, imagePart]);

    const result = await response.response.text();
    return res.json({ result });
  } catch (error) {
    console.log("Error while analyzing image through Gemini : ", error)
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { imageAnalysis, analyzeImageGemini };
