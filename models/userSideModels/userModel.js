const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String, // Changed to String to store as a string
  },
  password: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  dashImage: {
    type: String,
  },
  age: {
    type: Number, 
  },
  place: {
    type: String, 
  },
  district: {
    type: String, 
  },
  job: {
    type: String, 
  },
  organization: {
    type: String,
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plans',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);
