const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Function to read and compile email templates
const getCompiledTemplate = (templateName) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "emails",
    "templates",
    templateName
  );
  const template = fs.readFileSync(templatePath, "utf-8");
  return handlebars.compile(template);
};

// Email template functions
const sendVerificationEmail = async (resend, email, data) => {
  const template = getCompiledTemplate("verification-otp.html");
  const html = template(data);

  return await resend.emails.send({
    from: "Universa Healthcare Team <team@flowwrite.co>",
    to: email,
    subject: "Verify Your Email - Universa Healthcare",
    html,
  });
};

const sendResendOTPEmail = async (resend, email, data) => {
  const template = getCompiledTemplate("resend-otp.html");
  const html = template(data);

  return await resend.emails.send({
    from: "Universa Healthcare Team <team@flowwrite.co>",
    to: email,
    subject: "New Verification Code - Universa Healthcare",
    html,
  });
};

const sendPaymentEmail = async (resend, email, data) => {
  const template = getCompiledTemplate("node-payment.html");
  const html = template(data);

  return await resend.emails.send({
    from: "Universa Healthcare Team <team@flowwrite.co>",
    to: email,
    subject:
      "Welcome to UNIVERSA – Next Steps for Your Node Sponsorship",
    attachments: [
      {
        content: fs
          .readFileSync(
            path.join(
              __dirname,
              "../../documents/Singularity Center Agreement.pdf"
            )
          )
          .toString("base64"),
        filename: "Singularity Center Agreement.pdf",
      },
      {
        content: fs
          .readFileSync(
            path.join(
              __dirname,
              "../../documents/UNIVERSA Node Sponsorship Agreement.pdf"
            )
          )
          .toString("base64"),
        filename: "UNIVERSA Node Sponsorship Agreement.pdf",
      },
    ],
    html,
  });
};

module.exports = { sendResendOTPEmail, sendVerificationEmail, sendPaymentEmail };
