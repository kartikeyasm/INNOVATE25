const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String, // store image URL (upload logic will go elsewhere)
    
  },
  location: {
    type: String,
    required: true,
  },
  description: String,
  foundAt: {
    type: Date,
    default: Date.now,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // links to user who submitted
  }
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);
