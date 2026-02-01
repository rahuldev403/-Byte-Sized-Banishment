import nodemailer from "nodemailer";
import config from "../config/index.js";

const sendEmail = async (to, subject, text) => {
  try {
    console.log("Attempting to send email to:", to);
    console.log("Email config:", {
      service: config.SERVICE,
      user: config.EMAIL_USER,
      // Don't log the password for security
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    await transporter.sendMail({
      from: `Byte-Sized Banishment <${config.EMAIL_USER}>`,
      to,
      subject,
      html: text, // We will send HTML content for better formatting
    });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Email not sent:", error);
    console.error("Error details:", error.message);
  }
};

export default sendEmail;
