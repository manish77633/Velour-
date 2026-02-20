const express = require('express');
const router  = express.Router();
const {
  getProducts, getProductById, createProduct,
  updateProduct, deleteProduct, addReview, deleteReview,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',    getProducts);
router.get('/:id', getProductById);

router.post('/',       protect, adminOnly, createProduct);
router.put('/:id',     protect, adminOnly, updateProduct);
router.delete('/:id',  protect, adminOnly, deleteProduct);

router.post('/:id/reviews',                    protect, addReview);
router.delete('/:id/reviews/:reviewId',        protect, deleteReview);

module.exports = router;
