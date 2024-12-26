const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// POST /api/contact
router.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Ensure environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECEIVER_EMAIL) {
        return res.status(500).json({ error: "Email configuration is missing." });
    }

    try {
        // Configure the Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Use your email service
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or App Password
            },
        });

        // Define email options
        const mailOptions = {
            from: `Portfolio Contact Form `, // Custom sender name
            to: process.env.RECEIVER_EMAIL, // Your email address to receive messages
            subject: `Portfolio Contact Form Submission from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `, // HTML body
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);

        // Handle specific email errors
        if (error.response) {
            console.error("SMTP Response:", error.response);
        }

        res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
});

module.exports = router;
