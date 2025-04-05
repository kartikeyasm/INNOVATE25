const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendResetPasswordEmail } = require("../services/mailer.js"); // Import the mailer service
// const mongoose = require("mongoose");

// Secret key for JWT
const JWT_SECRET = "jags787"; // Replace with env var in real app

// SIGNUP
// SIGNUP
// SIGNUP
exports.signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Check if the email ends with @nsut.ac.in
  if (!email.endsWith('@nsut.ac.in')) {
    return res.status(403).json({ msg: 'Signup allowed only for NSUT email addresses' });
  }

  // Ensure all fields are provided
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User already exists' });

    // Hash the password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ msg: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the email is an NSUT email
    if (!email.endsWith("@nsut.ac.in")) {
      return res.status(400).json({ msg: "Only NSUT email IDs are allowed" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
};

// AUTH MIDDLEWARE
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid or expired" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });

    // Send the reset link via email
    await sendResetPasswordEmail(email, resetToken);

    return res.status(200).json({ msg: 'Password reset link sent to your email' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};