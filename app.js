const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");
const { nanoid } = require("nanoid");
const { error } = require("bytewatch/src/levels");

const app = express();

app.use(express.json());

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: "",
      domain: "",
    },
  })
);

const shortenUrl = async (longUrl) => {
  const accessToken = "";
  const apiUrl = ``;

  try {
    const response = await axios.post(
      apiUrl,
      {
        long_url: longUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error("Error shortening URL:", error);
    throw new Error("Failed to shorten URL");
  }
};

app.post("/shorten", async (req, res) => {
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

  try {
    // Shorten the URL
    const shortUrl = await shortenUrl(longUrl);

    const emailMessage = {
      from: "noreply@urlu.com",
      to: recipientEmail,
      subject: "Your Shortened URL",
      text: `Here is your shortened URL: ${shortUrl}`,
    };

    transporter.sendMail(emailMessage, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
          error: "Error sending email",
        });
      } else {
        console.log("Email sent:", info.response);
        res.json({
          message: "URL has been generated and sent to your email address",
        });
      }
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({
      error: "Failed to shorten URL",
    });
  }
});

module.exports = app;
