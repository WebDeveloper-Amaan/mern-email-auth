// ============================================
// Auth controller — register, verifyOtp, login, forgot, reset, resend
// ============================================
const User = require('../models/User');
const Otp = require('../models/Otp');
const { generateOtp, hashOtp } = require('../utils/generateOtp');
const { sendEmail, buildOtpEmail } = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

const OTP_EXP_MIN = Number(process.env.OTP_EXPIRY_MINUTES) || 10;

// Helper: build clean user JSON (never expose password)
const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  gender: user.gender,
  state: user.state,
  pinCode: user.pinCode,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});

// ----------------------------------------------------------
// POST /api/auth/register
// ----------------------------------------------------------
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, gender, state, pinCode } = req.body;

    if (!name || !email || !password || !mobile || !gender || !state || !pinCode) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create or update unverified user
    let user;
    if (existing && !existing.isVerified) {
      existing.name = name;
      existing.password = password; // pre-save hook will hash
      existing.mobile = mobile;
      existing.gender = gender;
      existing.state = state;
      existing.pinCode = pinCode;
      user = await existing.save();
    } else {
      user = await User.create({ name, email, password, mobile, gender, state, pinCode });
    }

    // Generate + send OTP
    const otp = generateOtp();
    await Otp.deleteMany({ email: user.email, purpose: 'register' });
    await Otp.create({
      email: user.email,
      otpHash: hashOtp(otp),
      purpose: 'register',
      expiresAt: new Date(Date.now() + OTP_EXP_MIN * 60 * 1000),
    });

    await sendEmail({
      to: user.email,
      subject: 'Verify your email — OTP inside',
      html: buildOtpEmail(user.name, otp, 'register'),
      text: `Your OTP is ${otp}. It expires in ${OTP_EXP_MIN} minutes.`,
    });

    res.status(201).json({
      success: true,
      message: 'Registered. OTP sent to your email.',
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------------
// POST /api/auth/verify-otp
// ----------------------------------------------------------
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }

    const record = await Otp.findOne({ email: email.toLowerCase(), purpose: 'register' });
    if (!record) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }

    if (record.attempts >= 5) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
    }

    if (record.otpHash !== hashOtp(otp)) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Success
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ _id: record._id });

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: sanitize(user),
    });
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------------
// POST /api/auth/resend-otp
// ----------------------------------------------------------
exports.resendOtp = async (req, res, next) => {
  try {
    const { email, purpose = 'register' } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = generateOtp();
    await Otp.deleteMany({ email: user.email, purpose });
    await Otp.create({
      email: user.email,
      otpHash: hashOtp(otp),
      purpose,
      expiresAt: new Date(Date.now() + OTP_EXP_MIN * 60 * 1000),
    });

    await sendEmail({
      to: user.email,
      subject: purpose === 'reset' ? 'Password reset OTP' : 'New verification OTP',
      html: buildOtpEmail(user.name, otp, purpose),
      text: `Your OTP is ${otp}. Expires in ${OTP_EXP_MIN} minutes.`,
    });

    res.json({ success: true, message: 'OTP resent' });
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------------
// POST /api/auth/login
// ----------------------------------------------------------
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email not verified. Please verify with OTP.',
        needsVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful', token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------------
// POST /api/auth/forgot-password
// ----------------------------------------------------------
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });

    // Generic response to prevent user enumeration
    const generic = {
      success: true,
      message: 'If that email exists, an OTP has been sent.',
    };

    if (!user) return res.json(generic);

    const otp = generateOtp();
    await Otp.deleteMany({ email: user.email, purpose: 'reset' });
    await Otp.create({
      email: user.email,
      otpHash: hashOtp(otp),
      purpose: 'reset',
      expiresAt: new Date(Date.now() + OTP_EXP_MIN * 60 * 1000),
    });

    await sendEmail({
      to: user.email,
      subject: 'Password reset OTP',
      html: buildOtpEmail(user.name, otp, 'reset'),
      text: `Your password reset OTP is ${otp}. Expires in ${OTP_EXP_MIN} minutes.`,
    });

    res.json(generic);
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------------
// POST /api/auth/reset-password
// ----------------------------------------------------------
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 chars' });
    }

    const record = await Otp.findOne({ email: email.toLowerCase(), purpose: 'reset' });
    if (!record) return res.status(400).json({ success: false, message: 'OTP expired or not found' });

    if (record.attempts >= 5) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(429).json({ success: false, message: 'Too many attempts.' });
    }

    if (record.otpHash !== hashOtp(otp)) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.password = newPassword; // pre-save hook will hash
    await user.save();
    await Otp.deleteOne({ _id: record._id });

    res.json({ success: true, message: 'Password reset successful. Please login.' });
  } catch (err) {
    next(err);
  }
};
