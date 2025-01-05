const OpenAI = require("openai");
const openai = new OpenAI();
const multer = require("multer");

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

module.exports = { imageAnalysis };
