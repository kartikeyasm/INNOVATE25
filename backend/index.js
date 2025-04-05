const express = require("express");
require('dotenv').config();
const app = express();
const mongoose = require("mongoose");
const routes = require('./routes/routes.js'); // Ensure this is correct path
const cors = require('cors');


// Define a port
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use(express.json()); // to parse JSON data

app.use('/api', routes); // Ensure '/api' prefix is added

const uri = process.env.MONGODB_URI 
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB via Mongoose"))
  .catch((err) => console.error("Mongoose connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
