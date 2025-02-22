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
const sendDocusignEnvelope = async (name, email, newSponsor, amount, nodes, country, address, areaOfInterest) => {
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
    "../documents/Singularity Center Agreement Updated.pdf"
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
    anchorString: "\spon-sign",
    anchorXOffset: "1.5",
    anchorUnits: "inches",
  });

  // Name tab
  const nameTab = new docusign.Text.constructFromObject({
    anchorString: "[Name:]",
    // anchorXOffset: "1",
    // anchorUnits: "inches",
    fontSize: "size12",
    tabLabel: "Name",
    value: name,
  });

  // Address tab
  const addressTab = new docusign.Text.constructFromObject({
    anchorString: "spon-address",
    fontSize: "size12",
    tabLabel: "Sponsor Address",
    value: address,
  });

  // Country tab
  const countryTab = new docusign.Text.constructFromObject({
    anchorString: "spon-country",
    fontSize: "size12",
    tabLabel: "Sponsor Country",
    value: country,
  });

  // Node Amount tab
  const nodeAmtTab = new docusign.Text.constructFromObject({
    anchorString: "spon-amt",
    fontSize: "size12",
    tabLabel: "Sponsor Amount",
    value: amount,
  });
  
  // Node Number tab
  const nodeNumTab = new docusign.Text.constructFromObject({
    anchorString: "spon-node",
    fontSize: "size12",
    tabLabel: "Sponsor Nodes Number",
    value: nodes,
  });

  // Title tab
  const titleTab = new docusign.Text.constructFromObject({
    anchorString: "spon-title",
    fontSize: "size12",
    tabLabel: "Sponsor Title",
    value: areaOfInterest,
  });

  // Email tab
  const emailTab = new docusign.Text.constructFromObject({
    anchorString: "Email Address:",
    fontSize: "size12",
    tabLabel: "Email",
    value: email,
  });
  
  const phoneNumTab = new docusign.Text.constructFromObject({
    anchorString: "\ph1",
    fontSize: "size12",
    tabLabel: "Phone Number"
  });

  // Date tab
  const dateTab = new docusign.DateSigned.constructFromObject({
    anchorString: "\date-h",
    tabLabel: "DateSigned"
    // anchorXOffset: "1",
    // anchorUnits: "inches",
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
    textTabs: [nameTab, emailTab, addressTab, nodeAmtTab, titleTab, countryTab, nodeNumTab, phoneNumTab], // add 'refTab' if required later
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
