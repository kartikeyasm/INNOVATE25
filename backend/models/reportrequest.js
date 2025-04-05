const mongoose = require('mongoose');

const reportRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  description: String,
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

module.exports = mongoose.model('ReportRequest', reportRequestSchema);
