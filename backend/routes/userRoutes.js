const express = require('express');
const router  = express.Router();
const {
  getProfile, updateProfile, changePassword,
  addAddress, deleteAddress, toggleWishlist, getAllUsers,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/profile',            protect, getProfile);
router.put('/profile',            protect, updateProfile);
router.put('/change-password',    protect, changePassword);
router.post('/address',           protect, addAddress);
router.delete('/address/:addrId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);

// Admin
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;
