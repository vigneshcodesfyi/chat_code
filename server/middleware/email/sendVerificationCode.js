const nodemailer = require("nodemailer");
const otpTemplate = require("./otpTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "your-email@gmail.com", // Use your email here
    pass: "your-email-password", // Use your actual email password or an app password
  },
});

// Function to send verification email
const sendVerificationCode = async (email, verificationCode) => {
  const mailOptions = {
    from: "your-email@gmail.com", // Sender's email
    to: email, // Receiver's email
    subject: "Verify Your Email Address",
    text: `Your verification code is: ${verificationCode}`,
    html: otpTemplate.replace("{verificationCode}", verificationCode),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification code sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    if (error.responseCode === 550) {
      console.error("Email failed to send: Invalid recipient address.");
    } else if (error.responseCode === 535) {
      console.error("Authentication failed: Check email credentials.");
    } else {
      console.error("Unexpected error:", error.message);
    }
  }
};

module.exports = sendVerificationCode;
