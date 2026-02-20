const express = require('express');
const router  = express.Router();
const {
  createRazorpayOrder, verifyPaymentAndCreateOrder,
  placeCODOrder, getMyOrders, getOrderById,
  getAllOrders, updateDeliveryStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment',        protect, verifyPaymentAndCreateOrder);
router.post('/place-cod',             protect, placeCODOrder);
router.get('/my-orders',              protect, getMyOrders);
router.get('/:id',                    protect, getOrderById);
router.get('/',                       protect, adminOnly, getAllOrders);
router.put('/:id/deliver',            protect, adminOnly, updateDeliveryStatus);

module.exports = router;
