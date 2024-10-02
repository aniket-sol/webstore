const mongoose = require('mongoose');

const loginRecordSchema = new mongoose.Schema({
  userId: {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
  },
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('LoginRecord', loginRecordSchema);
