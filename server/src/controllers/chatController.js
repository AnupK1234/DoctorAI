const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const axios = require("axios");
const { groq } = require("../config/groq");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const askAI = async (conversationHistory, input) => {
  const messages = conversationHistory.map((msg) => ({
    role: msg.sender ? "user" : "assistant",
    content: msg.content,
  }));
  messages.unshift({
    role: "system",
    content:
      "You are a highly knowledgeable and empathetic health expert. Your role is to provide accurate, concise, and professional guidance on a wide range of health topics, including physical health, mental health, nutrition, fitness, preventive care, and common medical conditions. You are designed to assist users with general health concerns, clarify medical concepts, and offer practical advice while ensuring the information is evidence-based and easy to understand. Always prioritize safety, and encourage consulting a qualified healthcare provider for severe or critical issues. You are not a substitute for professional medical care but a helpful guide for health-related queries. Respond thoughtfully, maintaining clarity, empathy, and professionalism. Avoid giving advice on topics outside of mental health. Always respond in 2-3 sentences.",
  });

  messages.push({ role: "user", content: input });

  /** Use of Biomistral for chatting */
  const messagesCopy = messages.slice(1);
  const OPENAI_API_URL = process.env.OPENAI_API_URL;
  const config = {
    method: "post",
    url: OPENAI_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    data: {
      model: "repository" || "gpt-4",
      messages: messagesCopy,
      stream: false,
    },
    responseType: "json",
  };

  const openAIResponse = await axios(config);
  // console.log("BIO reply : ", openAIResponse.data.choices[0].message);
  return openAIResponse.data.choices[0].message.content;

  // Use of GROQ for chatting
  // const response = await groq.chat.completions.create({
  //   model: "llama3-8b-8192",
  //   messages,
  // });
  // console.log("GROQ reply : ", response.choices[0].message.content);
  // return response.choices[0].message.content;
};

const generateTitle = async (messages) => {
  const messageContent = messages.map((msg) => msg.content).join(" ");
  const titleResponse = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content:
          'Analyze the following conversation messages and determine if the topic is medically related. If it is, generate a concise and professional title summarizing the conversation\'s main context. If not, return \'false\'. Format your response as: {"title": "<title or false>"}.',
      },
      { role: "user", content: messageContent },
    ],
  });
  try {
    const aiResponse = JSON.parse(titleResponse.choices[0]?.message?.content);
    return aiResponse.title || "false";
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return "false";
  }
};

const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = new Conversation({
      userId,
      title: "Untitled Conversation",
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;

    let conversationHistory = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    const response = await askAI(conversationHistory, content);

    const userMessage = new Message({ conversationId, sender, content });
    await userMessage.save();

    const botMessage = new Message({
      conversationId,
      sender: null, // null sender implies AI chatbot
      content: response,
    });
    await botMessage.save();

    // Update conversation title if this is the first message
    const conversation = await Conversation.findById(conversationId);
    if (conversation && conversation.title === "Untitled Conversation") {
      const allMessages = await Message.find({
        conversationId,
        sender: { $ne: null },
      }).sort({ createdAt: 1 });
      const newTitle = await generateTitle(allMessages);
      if (newTitle && newTitle !== "false") {
        conversation.title = newTitle;
        await conversation.save();
      }
    }
    res.status(201).json({
      userMessage,
      botMessage,
      conversationTitle: conversation.title,
      nodeState: conversation.nodeState,
    });

    /**
     * Has the user problems satisfied?
     * In db store the state of node question : T/F
     *  IF false then ask groq:
     *    if satisfied then: change F to T. Add new question to conversation "Would you like to create a node?"
     *
     *    Make usetimeout in FE of 5sec
     */
    let newMessage = null;
    if (!conversation.nodeState) {
      // const groqMessages = [
      //   ...conversationHistory.map((msg) => ({
      //     role: msg.sender ? "user" : "assistant",
      //     content: msg.content,
      //   })),
      //   { role: "user", content },
      //   { role: "assistant", content: response },
      // ];

      conversationHistory = [...conversationHistory, userMessage, botMessage]
      const messageContent = conversationHistory
      .map((msg) => `${msg.sender ? "User" : "Bot"}: ${msg.content}`)
      .join("\n");

      const isSatisfied = await askGroq(messageContent);
      console.log("Is satisfied : ", isSatisfied);
      if (isSatisfied) {
        // Update `nodeState` to true
        conversation.nodeState = true;
  
        // Add a new message to the conversation
        newMessage = new Message({
          conversationId,
          sender: null,
          content: "Would you like to create a node?",
        });
        await newMessage.save();
      }
    }
    
    await conversation.save();
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const askGroq = async (conversationHistory) => {
  try {
    const groqMessages = [
      {
        role: "system",
        content:
          "Analyze the following conversation messages and determine if the user is satisfied with the interaction. Respond with 'true' if the user appears satisfied, otherwise respond with 'false'. Strictly follow the format and dont mention any other irrelevant information.Format your response as: {\"satisfied\": <true/false>}.",
      },
      {
        role: "user",
        content: conversationHistory,
      },
    ];
    console.log("CONv : ", groqMessages);
    const analysisResponse = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: groqMessages,
    });

    // Parse the response
    const parsedResponse = JSON.parse(
      analysisResponse.choices[0].message.content
    );

    // Return the satisfaction result
    return parsedResponse.satisfied;
  } catch (error) {
    console.error("Error communicating with Groq:", error.message);
    throw new Error("Failed to analyze conversation with Groq.");
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({ userId }).sort({
      updatedAt: -1,
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const renameConversation = async (req, res) => {
  try {
    const { conversationId, newTitle } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { title: newTitle },
      { new: true }
    );
    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const deletedConversation = await Conversation.findOneAndDelete({
      _id: conversationId,
    });
    if (!deletedConversation)
      return res.status(404).json({ error: "Conversation not found" });
    res
      .status(200)
      .json({ message: "Conversation and its messages deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const chatImgAnalysis = async (req, res) => {
  try {
    const fileUrl = req?.file?.path;

    // console.log("File url : ", fileUrl);
    // console.log("Fileee : ", req.file)

    const imgBuffer = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(imgBuffer.data).toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // "gemini-2.0-flash-exp", "gemini-1.5-pro" also works

    // Create image part from buffer
    const imagePart = {
      inlineData: {
        data: base64Image,
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

    const { conversationId, sender, content, fileType } = req.body;

    const userMessage = new Message({
      conversationId,
      sender,
      content,
      fileUrl,
      fileType
    });
    await userMessage.save();

    const botMessage = new Message({
      conversationId,
      sender: null, // null sender implies AI chatbot
      content: result,
    });
    await botMessage.save();

    res
      .status(200)
      .json({ message: "Image Upload/Analysis success", content: result, newMsg: userMessage });
  } catch (error) {
    console.log("Error Uploading/Analyzing Image : ", error);
    res.status(500).json({
      message: "Error Uploading/Analyzing Image",
    });
  }
};

const chatPdfAnalysis = async (req, res) => {
  try {
    const fileUrl = req?.file?.path;
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });
    const pdfBuffer = Buffer.from(response.data, "binary");

    // Parse the PDF using pdf-parse
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    const prompt = `
Analyze the following medical text and generate a concise summary:
Text:
${pdfText}

Response format:
{
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
    const { summary } = parsedResponse;

    const { conversationId, sender, content, fileType } = req.body;

    const userMessage = new Message({
      conversationId,
      sender,
      content,
      fileUrl,
      fileType
    });
    await userMessage.save();

    const botMessage = new Message({
      conversationId,
      sender: null, // null sender implies AI chatbot
      content: summary,
    });
    await botMessage.save();

    res
      .status(200)
      .json({ message: "Document Upload/Analysis success", content: summary, newMsg: userMessage });
  } catch (error) {
    console.log("Error Uploading/Analyzing Document : ", error);
    res.status(500).json({
      message: "Error Uploading/Analyzing Document",
    });
  }
};

module.exports = {
  createConversation,
  addMessage,
  getConversationMessages,
  getUserConversations,
  deleteConversation,
  renameConversation,
  chatImgAnalysis,
  chatPdfAnalysis,
};
