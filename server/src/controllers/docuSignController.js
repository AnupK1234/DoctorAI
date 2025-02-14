const axios = require("axios");
const docusign = require("docusign-esign");
const path = require("path");
const fs = require("fs");

/**
 * Get Access token for docusign api usage
 */
const getAccessToken = async () => {
  const jwtLifeSec = 10 * 60;
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setOAuthBasePath(process.env.DOCUSIGN_AUTH_SERVER);
  let rsaKey = process.env.PRIVATE_KEY;
  const results = await dsApiClient.requestJWTUserToken(
    process.env.INTEGRATION_KEY,
    process.env.USER_ID,
    ["signature", "impersonation"],
    rsaKey,
    jwtLifeSec
  );
  return results.body.access_token;
};

// Send signing envelope to user
const sendDocusignEnvelope = async (name, email, newSponsor) => {
  // token for docusign
  const accessToken = await getAccessToken();

  // DocuSign API client setup
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath("https://demo.docusign.net/restapi");
  dsApiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopeApi = new docusign.EnvelopesApi(dsApiClient);

  // Load the PDF document
  const pdfPath = path.resolve(
    __dirname,
    "../documents/Singularity Center Agreement.pdf"
  );
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfBase64 = pdfBytes.toString("base64");

  // Document configuration
  const document = new docusign.Document();
  document.documentBase64 = pdfBase64;
  document.name = "Singularity Center Agreement";
  document.fileExtension = "pdf";
  document.documentId = "1";

  // Signer configuration
  const signer = new docusign.Signer();
  signer.email = email;
  signer.name = name;
  signer.recipientId = "1";
  signer.routingOrder = "1";

  // Signature tab
  const signHere = new docusign.SignHere.constructFromObject({
    anchorString: "Patient Signature:",
    anchorXOffset: "1.5",
    anchorUnits: "inches",
  });

  // Name tab
  const nameTab = new docusign.Text.constructFromObject({
    anchorString: "Name:",
    anchorXOffset: "1",
    anchorUnits: "inches",
    fontSize: "size12",
    tabLabel: "Name",
    value: name,
  });

  // Email tab
  const emailTab = new docusign.Text.constructFromObject({
    anchorString: "Email Address:",
    anchorXOffset: "1",
    anchorUnits: "inches",
    fontSize: "size12",
    tabLabel: "Email",
    value: email,
  });

  // Date tab
  const dateTab = new docusign.DateSigned.constructFromObject({
    anchorString: "Date:",
    anchorXOffset: "1",
    anchorUnits: "inches",
    tabLabel: "DateSigned",
  });

  //
  // const refTab = new docusign.Text.constructFromObject({
  //   anchorString: "Referred By: ",
  //   anchorXOffset: "50",
  //   anchorUnits: "pixels",
  //   fontSize: "size12",
  //   tabLabel: "ReferredBy",
  //   value: referral || "",
  //   required: false,
  // });

  // Combine all tabs
  const tabs = new docusign.Tabs.constructFromObject({
    signHereTabs: [signHere],
    textTabs: [nameTab, emailTab], // add 'refTab' if required later
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

  // Send the envelope
  const envelopeResult = await envelopeApi.createEnvelope(
    process.env.DS_ACCOUNT_ID,
    { envelopeDefinition }
  );

  // save envp id to sponsor model
  newSponsor.docusignEnvelopeId = envelopeResult.envelopeId;
  newSponsor.save();
};

module.exports = { getAccessToken, sendDocusignEnvelope };
