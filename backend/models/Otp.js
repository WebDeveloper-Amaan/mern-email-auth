// ============================================
// OTP schema - stores HASHED OTPs with TTL auto-delete
// ============================================
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    otpHash: { type: String, required: true }, // SHA-256 hash, never plain
    purpose: {
      type: String,
      enum: ['register', 'reset'],
      required: true,
    },
    attempts: { type: Number, default: 0 }, // brute-force protection
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index — MongoDB auto-deletes the document at expiresAt
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
