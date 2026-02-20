const User = require('../models/User');

// ── @route  GET /api/users/profile ───────────────────────────
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('orderHistory')
    .populate('wishlist', 'name images price category');

  res.json({ success: true, user });
};

// ── @route  PUT /api/users/profile ───────────────────────────
const updateProfile = async (req, res) => {
  const { name, phone, profilePicture } = req.body;
  const user = await User.findById(req.user._id);

  if (name)           user.name           = name;
  if (phone)          user.phone          = phone;
  if (profilePicture) user.profilePicture = profilePicture;

  await user.save();
  res.json({ success: true, user });
};

// ── @route  PUT /api/users/change-password ───────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user.password) {
    return res.status(400).json({ success: false, message: 'No password set. Please use Google login.' });
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
};

// ── @route  POST /api/users/address ──────────────────────────
const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
};

// ── @route  DELETE /api/users/address/:addrId ────────────────
const deleteAddress = async (req, res) => {
  const user    = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    (a) => a._id.toString() !== req.params.addrId
  );
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

// ── @route  POST /api/users/wishlist/:productId ───────────────
const toggleWishlist = async (req, res) => {
  const user      = await User.findById(req.user._id);
  const productId = req.params.productId;
  const idx       = user.wishlist.indexOf(productId);

  if (idx > -1) {
    user.wishlist.splice(idx, 1); // Remove
  } else {
    user.wishlist.push(productId); // Add
  }

  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};

// ── @route  GET /api/users  (Admin only) ─────────────────────
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
};

module.exports = {
  getProfile, updateProfile, changePassword,
  addAddress, deleteAddress, toggleWishlist, getAllUsers,
};
