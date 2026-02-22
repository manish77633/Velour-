const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// 1. Get Profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('orderHistory')
    .populate('wishlist', 'name images price category');
  res.json({ success: true, user });
};

// 2. Update Profile Info
const updateProfile = async (req, res) => {
  const { name, phone, profilePicture } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (profilePicture) user.profilePicture = profilePicture;

  await user.save();
  res.json({ success: true, user });
};

// 3. CHANGE PASSWORD (Logged In User) 🔒
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.user._id).select('+password');

  if (!user.password) {
    return res.status(400).json({ success: false, message: 'No password set. You use Google Login.' });
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Incorrect current password' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
};

// 4. FORGOT PASSWORD (Public - Send Email) 📧
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');

  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = `
    <h1>Password Reset Request</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>Link expires in 15 minutes.</p>
  `;

  try {
    await transporter.sendMail({
      from: `VELOUR Support <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Token',
      html: message,
    });
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
};

// 5. RESET PASSWORD (Public - Set New Password) 🔓
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful' });
};

// 6. Address & Wishlist
const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
};

const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addrId);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = user.wishlist.indexOf(req.params.productId);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(req.params.productId);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};

// ==========================================
// ADMIN CONTROLLERS (New Updates)
// ==========================================

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
};

// User ko Delete karna (Admin ke liye)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ success: false, message: 'Cannot delete an Admin user' });
      }
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: 'User removed completely' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Could not delete user' });
  }
};

// User ka Role Update karna (Admin ke liye)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.isAdmin !== undefined) {
        user.isAdmin = req.body.isAdmin;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Could not update user' });
  }
};

module.exports = {
  getProfile, updateProfile, changePassword,
  forgotPassword, resetPassword,
  addAddress, deleteAddress, toggleWishlist, 
  getAllUsers, deleteUser, updateUser // <-- Exports updated
};