require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Email Transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to Send Confirmation Email to Client
const sendConfirmationEmail = (clientEmail, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    subject: "Thank You for Your Callback Request",
    text: `Hi ${name},\n\nWe have received your callback request. Our team will contact you shortly.\n\nThank you!\n- Srisubamangala Finance Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending confirmation email to client:", error);
    } else {
      console.log("Confirmation email sent to client: " + info.response);
    }
  });
};

// Function to Notify Admin with Client Details
const sendAdminNotification = (clientData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to your own email
    subject: "New Client Callback Request Received",
    text: `You have received a new callback request:\n
    Name: ${clientData.name}
    Email: ${clientData.email}
    Mobile: ${clientData.mobile}
    Subject: ${clientData.subject}
    Message: ${clientData.message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending notification email to admin:", error);
    } else {
      console.log("Notification email sent to admin: " + info.response);
    }
  });
};

// API Route
app.post("/submit-form", (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    // Send confirmation email to client
    sendConfirmationEmail(email, name);

    // Send notification email to admin
    sendAdminNotification({ name, email, mobile, subject, message });

    res.status(201).json({ message: "Form submitted, and emails sent successfully!" });
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ error: "Failed to submit form" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

