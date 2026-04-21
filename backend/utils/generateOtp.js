// ============================================
// Crypto-secure 6-digit OTP + SHA-256 hashing
// ============================================
const crypto = require('crypto');

// Generate cryptographically random 6-digit OTP
const generateOtp = () => {
  // randomInt is uniformly distributed
  return crypto.randomInt(100000, 1000000).toString();
};

// Hash OTP before storing (so DB leak doesn't expose codes)
const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

module.exports = { generateOtp, hashOtp };
