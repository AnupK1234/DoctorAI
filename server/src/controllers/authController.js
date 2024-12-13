const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signToken, verifyToken } = require("../utils/jwtUtils");
const docusign = require("docusign-esign");
const path = require('path');
const fs = require('fs')

const signup = async (req, res) => {
  try {
    const { email, password, name, referral } = req.body;
    const user = await User.create({ email, password, name, referralCode: referral });

    // DocuSign API client setup
    const dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath("https://demo.docusign.net/restapi");
    dsApiClient.addDefaultHeader("Authorization", `Bearer ${process.env.DS_ACCESS_TOKEN}`);

    const envelopeApi = new docusign.EnvelopesApi(dsApiClient);

    // Load the PDF document
    const pdfPath = path.resolve( __dirname, "../documents/Consent Form2.pdf"); // Update to the correct path of your PDF
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBytes.toString("base64");

    // Document configuration
    const document = new docusign.Document();
    document.documentBase64 = pdfBase64;
    document.name = "Consent Form for Telehealth Consultation";
    document.fileExtension = "pdf";
    document.documentId = "1";

    // Signer configuration
    const signer = new docusign.Signer();
    signer.email = email;
    signer.name = name;
    signer.recipientId = "1";
    signer.routingOrder = "1";

    // Signature tab
    const signHere = new docusign.SignHere({
      anchorString: "/sn1/",
      anchorYOffset: "10",
      anchorUnits: "pixels",
    });

    // Name tab
    const nameTab = new docusign.Text({
      anchorString: "/name1/",
      anchorYOffset: "10",
      anchorUnits: "pixels",
      font: "helvetica",
      fontSize: "size12",
      bold: true,
      tabLabel: "Name",
      value: name, // Pre-fills the name field
    });

    // Date of Birth tab
    const dobTab = new docusign.Text({
      anchorString: "/dob1/",
      anchorYOffset: "10",
      anchorUnits: "pixels",
      font: "helvetica",
      fontSize: "size12",
      bold: true,
      tabLabel: "DateOfBirth",
    });

    // Phone Number tab
    const phoneTab = new docusign.Text({
      anchorString: "/phone1/",
      anchorYOffset: "10",
      anchorUnits: "pixels",
      font: "helvetica",
      fontSize: "size12",
      bold: true,
      tabLabel: "Phone",
    });

    // Email tab
    const emailTab = new docusign.Text({
      anchorString: "/email1/",
      anchorYOffset: "10",
      anchorUnits: "pixels",
      font: "helvetica",
      fontSize: "size12",
      bold: true,
      tabLabel: "Email",
      value: email, // Pre-fills the email field
    });

    // Date tab
    const dateTab = new docusign.DateSigned({
      anchorString: "/date1/",
      anchorYOffset: "10",
      anchorUnits: "pixels",
      tabLabel: "DateSigned",
    });

    
    const refTab = new docusign.Text.constructFromObject({
      anchorString: "Referred By: ", // Ensure this placeholder exists in the PDF
      anchorXOffset: "50",
      anchorUnits: "pixels",
      font: "helvetica",
      fontSize: "size12",
      bold: true,
      tabLabel: "ReferredBy",
      value: referral, // Pre-fills the "Referred By" field with the referral value
    });


    // Combine all tabs
    const tabs = new docusign.Tabs.constructFromObject({
      signHereTabs: [signHere],
      textTabs: [nameTab, dobTab, phoneTab, emailTab, refTab],
      dateSignedTabs: [dateTab],
    });
    signer.tabs = tabs;

    // Envelope definition
    const envelopeDefinition = new docusign.EnvelopeDefinition();
    envelopeDefinition.emailSubject = "Please sign this agreement document";
    envelopeDefinition.documents = [document];
    envelopeDefinition.recipients = {
      signers: [signer],
    };
    envelopeDefinition.status = "sent";

    // console.log("Envelope Definition:", JSON.stringify(envelopeDefinition, null, 2));

    
    // Send the envelope
    const envelopeResult = await envelopeApi.createEnvelope(process.env.DS_ACCOUNT_ID, { envelopeDefinition });

    // Save the envelope ID to the user
    user.docusignEnvelopeId = envelopeResult.envelopeId;
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, email, name },
    });
  } catch (error) {
    console.log("ERRRR : ", error);
    
    res.status(400).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    const userObject = { _id: user._id, name: user.name, email: user.email };

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email, name: user.name },
      cookie: { token, userObject },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("userObject");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { signup, login, logout };
