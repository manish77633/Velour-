const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, changePassword,
  forgotPassword, resetPassword,
  addAddress, deleteAddress, toggleWishlist, getAllUsers
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 🔒 PROTECTED ROUTES (Login Required)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword); // <-- Profile page se change karne ke liye
router.post('/address', protect, addAddress);
router.delete('/address/:addrId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);

// 🔓 PUBLIC ROUTES (No Login Required)
router.post('/forgot-password', forgotPassword);        // <-- Email bhejne ke liye
router.put('/reset-password/:token', resetPassword);    // <-- Naya password set karne ke liye

// 🛡️ ADMIN
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;