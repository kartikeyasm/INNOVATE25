const nodemailer = require("nodemailer");

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jagrit.jain.ug22@nsut.ac.in", // Your email address
    pass: "J%40grit32", // Your email password or app password (for Gmail)
  },
});

const sendResetPasswordEmail = async (userEmail, resetToken) => {
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: "your-email@gmail.com",
    to: userEmail,
    subject: "Password Reset Request",
    text: `You requested to reset your password. Please click the link below to reset your password:
    ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendResetPasswordEmail };
