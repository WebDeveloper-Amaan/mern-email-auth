// ============================================
// User controller — protected profile route
// ============================================
exports.getProfile = async (req, res) => {
  // req.user is set by protect middleware
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
      gender: req.user.gender,
      state: req.user.state,
      pinCode: req.user.pinCode,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
    },
  });
};
