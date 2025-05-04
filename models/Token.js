// models/Token.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userType: { type: String, enum: ['user', 'researcher'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);
