const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const queryController = require('../controllers/queryController');


// Auth Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

// (Optional) Protected test route
router.get("/protected", authController.authMiddleware, (req, res) => {
  res.json({ msg: "This is a protected route", userId: req.userId });
});

router.post("/cant-find-in-llm", queryController.createReport); // Create a report request
router.post("/found-request", queryController.foundRequest); // Mark a report as found

module.exports = router;
