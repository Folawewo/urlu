// controllers/urlController.js
const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");
const { nanoid } = require("nanoid");
const { isValidEmail } = require("../utils/validation");

const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: process.env.api_key,
      domain: process.env.domain,
    },
  })
);

const urlDatabase = new Map();

const generateShortUrl = () => {
  return nanoid(4);
};

const shortenUrl = (req, res) => {
  const longUrl = req.body.url;
  const recipientEmail = req.body.email;

  // Validating recipient's email address
  if (
    !recipientEmail ||
    typeof recipientEmail !== "string" ||
    !isValidEmail(recipientEmail)
  ) {
    return res.status(400).json({
      error: "Invalid email provided",
    });
  }

  // Generate short URL
  const shortUrl = generateShortUrl();
  urlDatabase.set(shortUrl, longUrl);

  const emailMessage = {
    from: "URLU <noreply@urlu.com>",
    to: recipientEmail,
    subject: "Your Shortened URL",
    html: `<p>Here is your shortened URL: <a href="https://localhost:8000/${shortUrl}">https://localhost:8000/${shortUrl}</a></p>`,
  };

  transporter.sendMail(emailMessage, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        error: "Error sending email",
      });
    } else {
      console.log("Email sent:", info);
      res.json({
        message: "URL has been generated and sent to your email address",
        shortUrl: shortUrl,
      });
    }
  });
};

const redirectUrl = (req, res) => {
  const shortCode = req.params.shortCode;
  const longUrl = urlDatabase.get(shortCode);

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).json({
      error: "URL not found",
    });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
};
