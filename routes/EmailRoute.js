require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const EmailRoute = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

EmailRoute.post("/send", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res
      .status(400)
      .json({ error: "All fields are required: to, subject, text" });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text,
    });

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(" Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = EmailRoute;
