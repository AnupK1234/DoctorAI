const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const axios = require('axios');
const { groq } = require('../config/groq');
const OpenAI = require('openai');
const { sendSSEUpdate } = require("../utils/sseHandler")

const openAiClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const askAiIfTheConditionIsChronic = async (conversationHistory) => {
  try {
    const groqMessages = [
      {
        role: 'system',
        content: `Analyze the following conversation messages and determine if the bot the user has a chronic medical condition. If the user has a chronic condition return true. Else return false as specified. 
          Some examples of chronic conditions include diabetes, hypertension, asthma, arthritis, and heart disease etc.
          Strictly follow the format and dont mention any other irrelevant information. Format your response as: {"isChronic": <true/false>}.`,
      },
      {
        role: 'user',
        content: conversationHistory,
      },
    ];
    // console.log('CONv : ', groqMessages);
    const analysisResponse = await openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: groqMessages,
    });

    console.log('Analysis Response : ', analysisResponse.choices[0].message);
    // Parse the response
    const parsedResponse = JSON.parse(
      analysisResponse.choices[0].message.content
    );

    // Return the satisfaction result
    return parsedResponse.isChronic;
  } catch (error) {
    console.error('Error communicating with Groq:', error.message);
    throw new Error('Failed to analyze conversation with Groq.');
  }
};

const askAiIfTheUserSaidYesToCreateNode = async (conversationHistory) => {
  try {
    const groqMessages = [
      {
        role: 'system',
        content: `Analyze the following conversation messages and determine if the user said yes to creating the node. if the user said yes return true. Else return false as specified. If you are unable to determine return false.
        Strictly follow the format and dont mention any other irrelevant information. Format your response as: {"saidYes": <true/false>}.`,
      },
      {
        role: 'user',
        content: conversationHistory,
      },
    ];
    // console.log('CONv : ', groqMessages);
    const analysisResponse = await openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: groqMessages,
    });

    console.log('Analysis Response : ', analysisResponse.choices[0].message);
    // Parse the response
    const parsedResponse = JSON.parse(
      analysisResponse.choices[0].message.content
    );

    // Return the satisfaction result
    return parsedResponse.saidYes;
  } catch (error) {
    console.error('Error communicating with Groq:', error.message);
    throw new Error('Failed to analyze conversation with Groq.');
  }
};

const askAiIfTheAssistantHasSentTheNodeLink = async (conversationHistory) => {
  try {
    const groqMessages = [
      {
        role: 'system',
        content: `Analyze the following conversation messages and determine if the bot has shared the link to www.airesearchnode.com successfully to the user for node creation. if the user said yes return true. Else return false as specified. If you are unable to determine return false.
        Strictly follow the format and dont mention any other irrelevant information. Format your response as: {"shared": <true/false>}.`,
      },
      {
        role: 'user',
        content: conversationHistory,
      },
    ];
    // console.log('CONv : ', groqMessages);
    const analysisResponse = await openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: groqMessages,
    });

    console.log('Analysis Response : ', analysisResponse.choices[0].message);
    // Parse the response
    const parsedResponse = JSON.parse(
      analysisResponse.choices[0].message.content
    );

    // Return the satisfaction result
    return parsedResponse.shared;
  } catch (error) {
    console.error('Error communicating with Groq:', error.message);
    throw new Error('Failed to analyze conversation with Groq.');
  }
};

const askGroq = async function askAiIfTheUserIsSatisfied(conversationHistory) {
  try {
    const groqMessages = [
      {
        role: 'system',
        content:
          "Analyze the following conversation messages and determine if the bot has answered the user's question in the interaction. If the last part is a question from the bot. Return false as the user will respond and talk more. Analyse accordingly. Respond with 'true' if the bot answered or suggested some answer, otherwise respond with 'false'. Strictly follow the format and dont mention any other irrelevant information. Format your response as: {\"satisfied\": <true/false>}.",
      },
      {
        role: 'user',
        content: conversationHistory,
      },
    ];
    // console.log('CONv : ', groqMessages);
    const analysisResponse = await openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: groqMessages,
    });

    console.log('Analysis Response : ', analysisResponse.choices[0].message);
    // Parse the response
    const parsedResponse = JSON.parse(
      analysisResponse.choices[0].message.content
    );

    // Return the satisfaction result
    return parsedResponse.satisfied;
  } catch (error) {
    console.error('Error communicating with Groq:', error.message);
    throw new Error('Failed to analyze conversation with Groq.');
  }
};

/**
 * @description The only job of the marketing AI is to sell the custom node. It makes sure the user understands about the node and tries its best to the sell the node to the user.
 *
 */

const askMarketingAi = async (conversationHistory) => {
  const messageContent = conversationHistory
    .map((msg) => `${msg.sender ? 'User' : 'Bot'}: ${msg.content}`)
    .join('\n');

  try {
    const groqMessages = [
      {
        role: 'system',
        content: `You are an expert salesman which sell personalised AI research Nodes. Just share the link www.airesearchnode.com. You are currently trying to sell these Reaseach nodes for medical purposes. Your job is to share the research node link www.airesearchnode.com so that the user can learn more about the AI Research Node and sign up to the service if they want.

    Share the link to the website www.airesearchnode.com where the users can learn more about the AI Research Node.
    On the site www.airesearchnode.com the users can learn the following: 
    How your dedicated AI Research Node works?
    The atlas tracking system
    The research participation process and a lot more.

    The users will need to sign a contract and there node will run continously and keeo helping them to find unique and new solutions for their medical conditions.

    Always share the link to the website www.airesearchnode.com to the users.

    Its a real AI service our company provides and the users can sign up for it. Always share the link to the website www.airesearchnode.com to the users.         
          `,
      },
      {
        role: 'user',
        content: messageContent,
      },
    ];
    // console.log('CONv : ', groqMessages);
    const analysisResponse = await openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: groqMessages,
    });

    console.log('Analysis Response : ', analysisResponse.choices[0].message);
    // Parse the response
    return analysisResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error communicating with Groq:', error.message);
    throw new Error('Failed to analyze conversation with Groq.');
  }
};

const askAI = async (conversationHistory, input) => {
  const messages = conversationHistory.map((msg) => ({
    role: msg.sender ? 'user' : 'assistant',
    content: msg.content,
  }));

  // If two assistant messages are consecutive, or two user messages are consecutive, club those together

  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].role === messages[i + 1].role) {
      messages[i].content += ' ' + messages[i + 1].content;
      messages.splice(i + 1, 1);
      i--;
    }
  }

  messages.unshift({
    role: 'system',
    content:
      'You are a highly knowledgeable and empathetic health expert. Your role is to provide accurate, concise, and professional guidance on a wide range of health topics, including physical health, mental health, nutrition, fitness, preventive care, and common medical conditions. You are designed to assist users with general health concerns, clarify medical concepts, and offer practical advice while ensuring the information is evidence-based and easy to understand. Always give out all the possible information you can on medical related topics. Always provide informaiton on the medicines the user can take etc. Always provide all the information to the user. Also, always ask quesitons you need to understand the situation better if that can help you to give better responses. Respond thoughtfully, maintaining clarity, empathy, and professionalism. Give answers to any and all medical related topics. Always respond in 2-3 sentences.',
  });

  messages.push({ role: 'user', content: input });

  /** Use of Biomistral for chatting */
  const messagesCopy = messages.slice(1);
  const OPENAI_API_URL = process.env.OPENAI_API_URL;
  const config = {
    method: 'post',
    url: OPENAI_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    data: {
      model: 'gpt-4o',
      messages: messagesCopy,
      stream: false,
    },
    responseType: 'json',
  };

  const openAIResponse = await axios(config);
  // console.log("BIO reply : ", openAIResponse.data.choices[0].message);
  return openAIResponse.data.choices[0].message.content;
};

const generateTitle = async (messages) => {
  const messageContent = messages.map((msg) => msg.content).join(' ');
  const titleResponse = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [
      {
        role: 'system',
        content:
          'Analyze the following conversation messages and determine if the topic is medically related. If it is, generate a concise and professional title summarizing the conversation\'s main context. If not, return \'false\'. Format your response as: {"title": "<title or false>"}.',
      },
      { role: 'user', content: messageContent },
    ],
  });
  try {
    const aiResponse = JSON.parse(titleResponse.choices[0]?.message?.content);
    return aiResponse.title || 'false';
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return 'false';
  }
};

const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = new Conversation({
      userId,
      title: 'Untitled Conversation',
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
    console.log('here', req.body);
    let conversationHistory = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    const userMessage = new Message({ conversationId, sender, content });
    await userMessage.save();

    const conversation = await Conversation.findById(conversationId);

    let response;

    if (
      conversation.nodeState &&
      conversation.isChronicDisease &&
      !conversation.sentNodeLink
    ) {
      console.log('inside marketing ai', 8698);
      response = await askMarketingAi(conversationHistory, content);
    } else {
      response = await askAI(conversationHistory, content);
      console.log({ response });
    }

    const botMessage = new Message({
      conversationId,
      sender: null, // null sender implies AI chatbot
      content: response,
    });
    await botMessage.save();

    // Update conversation title if this is the first message
    if (conversation && conversation.title === 'Untitled Conversation') {
      const allMessages = await Message.find({
        conversationId,
        sender: { $ne: null },
      }).sort({ createdAt: 1 });
      const newTitle = await generateTitle(allMessages);
      if (newTitle && newTitle !== 'false') {
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

    let newMessage = null;

    // const groqMessages = [
    //   ...conversationHistory.map((msg) => ({
    //     role: msg.sender ? "user" : "assistant",
    //     content: msg.content,
    //   })),
    //   { role: "user", content },
    //   { role: "assistant", content: response },
    // ];

    conversationHistory = [...conversationHistory, userMessage, botMessage];
    const messageContent = conversationHistory
      .map((msg) => `${msg.sender ? 'User' : 'Bot'}: ${msg.content}`)
      .join('\n');

    const isSatisfied = await askGroq(
      messageContent,
      conversationHistory.length
    );

    console.log('Is satisfied : ', isSatisfied);

    if (
      (isSatisfied && conversation.suggestedEnhancements == false) ||
      (conversation.nodeState &&
        conversation.isChronicDisease &&
        !conversation.sentNodeLink)
    ) {
      const isConditionChronic =
        conversation.isChronicDisease ||
        (await askAiIfTheConditionIsChronic(messageContent));

      if (!isConditionChronic) {
        console.log('Is Chronic : ', { isConditionChronic });
        // Update `nodeState` to true
        conversation.isChronicDisease = false;

        // Now send the ask enhaement health features question

        newMessage = new Message({
          conversationId,
          sender: null,
          content: `I'd like to introduce you to something beyond traditional healthcare. While I can help with medical conditions, I can also assist in exploring ways to enhance human capabilities - both physical and cognitive. This includes potential improvements in areas like mental performance, physical capabilities, overall wellbeing and longevity. Would you like to learn more about these enhancement possibilities?`,
        });

        conversation.suggestedEnhancements = true;
        await newMessage.save();
      }

      if (isConditionChronic) {
        if (conversation.nodeState == false) {
          // Check if the user has  And the model has responsded again and that flow of conversation has ended. Because now we need to ask the user if they want to create a node
          conversation.isChronicDisease = true;

          newMessage = new Message({
            conversationId,
            sender: null,
            content: `It seems like you have a chronic medical condition. While there isn't currently a cure, I can offer you something unique: a dedicated AI Research Node focused solely on finding a solution for your condition. This requires signing a research participation agreement. Would you like to learn more about this option? You can learn more about it on www.airesearchnode.com as well.`,
          });

          conversation.nodeState = true;
          await newMessage.save();
        } else {
          // Check if the user has said yes to creating a node and the model has responded to that. If yes, then we need to ask the user for their consent to sign the agreement etc

          const result = await askAiIfTheAssistantHasSentTheNodeLink(
            messageContent
          );

          if (result) {
            conversation.sentNodeLink = true;
          }

          console.log('askAiIfTheAssistantHasSentTheNodeLink', { result });
        }
      }
    }

    if (newMessage) {
      // console.log("New msg created : ", newMessage)
      sendSSEUpdate(conversationId, {
        type: 'new_message',
        message: newMessage
      });
    }

    await conversation.save();
  } catch (err) {
    console.log({ err });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    console.log('Returning messages for convo: ');
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
      return res.status(404).json({ error: 'Conversation not found' });
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
      return res.status(404).json({ error: 'Conversation not found' });
    res
      .status(200)
      .json({ message: 'Conversation and its messages deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const chatImgAnalysis = async (req, res) => {
  try {
    const fileUrl = req?.file?.path;

    // console.log("File url : ", fileUrl);
    // console.log("Fileee : ", req.file)

    const imgBuffer = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(imgBuffer.data).toString('base64');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }); // "gemini-2.0-flash-exp", "gemini-1.5-pro" also works

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
      fileType,
    });
    await userMessage.save();

    const botMessage = new Message({
      conversationId,
      sender: null, // null sender implies AI chatbot
      content: result,
    });
    await botMessage.save();

    res.status(200).json({
      message: 'Image Upload/Analysis success',
      content: result,
      newMsg: userMessage,
    });
  } catch (error) {
    console.log('Error Uploading/Analyzing Image : ', error);
    res.status(500).json({
      message: 'Error Uploading/Analyzing Image',
    });
  }
};

const chatPdfAnalysis = async (req, res) => {
  try {
    const fileUrl = req?.file?.path;
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });
    const pdfBuffer = Buffer.from(response.data, 'binary');

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
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-8b-8192',
    });

    if (
      !completion ||
      !completion.choices ||
      !completion.choices.length ||
      !completion.choices[0].message
    ) {
      throw new Error('Failed to generate title and summary from Groq.');
    }

    const responseText = completion.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Groq response.');
    }

    const parsedResponse = JSON.parse(jsonMatch);
    const { summary } = parsedResponse;

    const { conversationId, sender, content, fileType } = req.body;

    const userMessage = new Message({
      conversationId,
      sender,
      content,
      fileUrl,
      fileType,
    });
    await userMessage.save();

    const botMessage = new Message({
      conversationId,
      sender: null, // null sender implies AI chatbot
      content: summary,
    });
    await botMessage.save();

    res.status(200).json({
      message: 'Document Upload/Analysis success',
      content: summary,
      newMsg: userMessage,
    });
  } catch (error) {
    console.log('Error Uploading/Analyzing Document : ', error);
    res.status(500).json({
      message: 'Error Uploading/Analyzing Document',
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
