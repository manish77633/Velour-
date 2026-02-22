const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, changePassword,
  forgotPassword, resetPassword,
  addAddress, deleteAddress, toggleWishlist, 
  getAllUsers, deleteUser, updateUser // <-- ये दो नए जोड़े गए हैं
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 🔒 PROTECTED ROUTES (Login Required)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword); 
router.post('/address', protect, addAddress);
router.delete('/address/:addrId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);

// 🔓 PUBLIC ROUTES (No Login Required)
router.post('/forgot-password', forgotPassword);        
router.put('/reset-password/:token', resetPassword);    

// 🛡️ ADMIN ROUTES (Super Admin Management)
router.get('/', protect, adminOnly, getAllUsers);
router.route('/:id')
  .delete(protect, adminOnly, deleteUser) // User delete karne ke liye
  .put(protect, adminOnly, updateUser);   // User ka role update karne ke liye

module.exports = router;