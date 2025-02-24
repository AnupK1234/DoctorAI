const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signToken, verifyToken } = require("../utils/jwtUtils");
const docusign = require("docusign-esign");
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { getAccessToken } = require("./docuSignController");
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const {sendVerificationEmail, sendResendOTPEmail} = require("../emails/templates/index")

const signup = async (req, res) => {
  try {
    const { email, password, name, referral } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Save user details to the database (without confirming yet)
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    const user = await User.create({
      name,
      email,
      password,
      referralCode: referral,
      isVerified: false,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    });

    // Send OTP email using Resend
    await sendVerificationEmail(resend, email, {
      name,
      otp,
    });

    const token = signToken(user._id);
    const userObject = { _id: user._id, name: user.name, email: user.email };

    // token for docusign
    // const accessToken = await getAccessToken();

    // // DocuSign API client setup
    // const dsApiClient = new docusign.ApiClient();
    // dsApiClient.setBasePath("https://demo.docusign.net/restapi");
    // dsApiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

    // const envelopeApi = new docusign.EnvelopesApi(dsApiClient);

    // // Load the PDF document
    // const pdfPath = path.resolve( __dirname, "../documents/Consent Form2.pdf"); // Update to the correct path of your PDF
    // const pdfBytes = fs.readFileSync(pdfPath);
    // const pdfBase64 = pdfBytes.toString("base64");

    // // Document configuration
    // const document = new docusign.Document();
    // document.documentBase64 = pdfBase64;
    // document.name = "Consent Form for Telehealth Consultation";
    // document.fileExtension = "pdf";
    // document.documentId = "1";

    // // Signer configuration
    // const signer = new docusign.Signer();
    // signer.email = email;
    // signer.name = name;
    // signer.recipientId = "1";
    // signer.routingOrder = "1";

    // // Signature tab
    // const signHere = new docusign.SignHere.constructFromObject({
    //   anchorString: "Patient Signature:",
    //   anchorXOffset: "1.5",
    //   anchorUnits: "inches",
    // });

    // // Name tab
    // const nameTab = new docusign.Text.constructFromObject({
    //   anchorString: "Name:",
    //   anchorXOffset: "1",
    //   anchorUnits: "inches",
    //   fontSize: "size12",
    //   tabLabel: "Name",
    //   value: name,
    // });

    // // Email tab
    // const emailTab = new docusign.Text.constructFromObject({
    //   anchorString: "Email Address:",
    //   anchorXOffset: "1",
    //   anchorUnits: "inches",
    //   fontSize: "size12",
    //   tabLabel: "Email",
    //   value: email, 
    // });

    // // Date tab
    // const dateTab = new docusign.DateSigned.constructFromObject({
    //   anchorString: "Date:",
    //   anchorXOffset: "1",
    //   anchorUnits: "inches",
    //   tabLabel: "DateSigned",
    // });

    
    // const refTab = new docusign.Text.constructFromObject({
    //   anchorString: "Referred By: ",
    //   anchorXOffset: "50",
    //   anchorUnits: "pixels",
    //   fontSize: "size12",
    //   tabLabel: "ReferredBy",
    //   value: referral || "",
    //   required: false
    // });


    // // Combine all tabs
    // const tabs = new docusign.Tabs.constructFromObject({
    //   signHereTabs: [signHere],
    //   textTabs: [nameTab, emailTab, refTab],
    //   dateSignedTabs: [dateTab],
    // });
    // signer.tabs = tabs;

    // // Envelope definition
    // const envelopeDefinition = new docusign.EnvelopeDefinition();
    // envelopeDefinition.emailSubject = "Please sign this agreement document";
    // envelopeDefinition.documents = [document];
    // envelopeDefinition.recipients = {
    //   signers: [signer],
    // };
    // envelopeDefinition.status = "sent";

    // // console.log("Envelope Definition:", JSON.stringify(envelopeDefinition, null, 2));

    
    // // Send the envelope
    // const envelopeResult = await envelopeApi.createEnvelope(process.env.DS_ACCOUNT_ID, { envelopeDefinition });

    // // Save the envelope ID to the user
    // user.docusignEnvelopeId = envelopeResult.envelopeId;
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: { _id: user._id, email, name },
      cookie: { token, userObject },
    });
  } catch (error) {
    console.log("ERRRR : ", error);
    
    res.status(400).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== Number(otp) || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    await sendResendOTPEmail(resend, email, {
      name: user.name,
      otp,
    });

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
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
      user: { _id: user._id, email, name: user.name },
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

module.exports = { signup, login, logout, verifyOtp, resendOtp  };
