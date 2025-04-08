const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  photo1: {
    type: String, // Store the file path or URL of the first photo
    required: true,
  },
  photo2: {
    type: String, // Store the file path or URL of the second photo
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now, // Store when the session was submitted
  }
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;