// models/WhitelistedUser.js
const mongoose = require('mongoose');

const whitelistedUserSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WhitelistedUser', whitelistedUserSchema);