const ReportRequest = require("../models/reportrequest"); // Import the model
const FoundItem = require("../models/foundItem");

// Function to handle the report creation
exports.createReport = async (req, res) => {
  const { name, photoUrl, location, description, reportedBy } = req.body;

  // Validate required fields
  if (!name || !location || !reportedBy) {
    return res
      .status(400)
      .json({ error: "Name, location, and reportedBy are required." });
  }

  try {
    // Create a new reportRequest document
    const reportRequest = new ReportRequest({
      name,
      photoUrl,
      location,
      description,
      reportedBy,
    });

    // Save to the database
    await reportRequest.save();

    // Respond with the saved report
    res.status(201).json({
      message: "Report successfully created",
      reportRequest,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the report." });
  }
};
// Import the FoundItem model

// Controller function for creating a found item request
exports.foundRequest = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    // Create a new found item document
    const foundItem = new FoundItem({
      name,
      location,
      description,

      // photoUrl,  // photoUrl is optional
    });

    // Save the found item to the database
    await foundItem.save();

    // Respond with success message and the saved found item
    res.status(201).json({
      message: "Found item successfully created",
      foundItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating found item" });
  }
};
