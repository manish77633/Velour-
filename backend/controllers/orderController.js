const crypto   = require('crypto');
const Razorpay = require('razorpay');
const Order    = require('../models/Order');
const Product  = require('../models/Product');
const User     = require('../models/User');

// Razorpay instance
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── @route  POST /api/orders/create-razorpay-order ───────────
// Step 1: Create Razorpay order_id from backend
const createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  const options = {
    amount:   Math.round(amount * 100), // Razorpay expects paise (1 INR = 100 paise)
    currency,
    receipt:  `receipt_${Date.now()}`,
    notes: {
      userId: req.user._id.toString(),
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.json({
    success:  true,
    orderId:  razorpayOrder.id,
    amount:   razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key:      process.env.RAZORPAY_KEY_ID,
  });
};

// ── @route  POST /api/orders/verify-payment ──────────────────
// Step 2: Verify Razorpay signature (HMAC-SHA256) & save order
const verifyPaymentAndCreateOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    discount,
    promoCode,
  } = req.body;

  // ── Signature Verification (HMAC-SHA256) ─────────────────
  const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected  = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Payment verification failed: Invalid signature',
    });
  }

  // ── Signature valid → Create order in DB ─────────────────
  const order = await Order.create({
    user:              req.user._id,
    orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    discount:          discount || 0,
    promoCode,
    razorpayOrderId:   razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    paymentStatus:     'paid',
    isPaid:            true,
    paidAt:            new Date(),
  });

  // Add order to user's history
  await User.findByIdAndUpdate(req.user._id, {
    $push: { orderHistory: order._id },
  });

  // Reduce stock for each ordered product
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stockQuantity: -item.quantity },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Payment verified and order placed!',
    order,
  });
};

// ── @route  GET /api/orders/my-orders ────────────────────────
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'name images category')
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
};

// ── @route  GET /api/orders/:id ──────────────────────────────
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images price');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Only owner or admin can view
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  res.json({ success: true, order });
};

// ── @route  GET /api/orders  (Admin only) ────────────────────
const getAllOrders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = status ? { deliveryStatus: status } : {};

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, orders, total });
};

// ── @route  PUT /api/orders/:id/deliver  (Admin only) ────────
const updateDeliveryStatus = async (req, res) => {
  const { deliveryStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.deliveryStatus = deliveryStatus;
  if (deliveryStatus === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();
  res.json({ success: true, order });
};


// ── @route  POST /api/orders/place-cod ───────────────────────
// Cash on Delivery - no payment verification needed
const placeCODOrder = async (req, res) => {
  const {
    orderItems, shippingAddress,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  const order = await Order.create({
    user:           req.user._id,
    orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod:  'cod',
    paymentStatus:  'pending',
    isPaid:         false,
    deliveryStatus: 'processing',
  });

  // Add to user's order history
  await User.findByIdAndUpdate(req.user._id, {
    $push: { orderHistory: order._id },
  });

  // Reduce stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stockQuantity: -item.quantity },
    });
  }

  res.status(201).json({
    success: true,
    message: 'COD order placed successfully!',
    order,
  });
};
module.exports = {
  placeCODOrder,
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateDeliveryStatus,
};
