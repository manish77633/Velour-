const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Reusable Email Template Helper ─────────────────────────────
const sendOrderEmail = async (order, user, title) => {
  try {
    const subject = `${title}: #${order._id.toString().slice(-6).toUpperCase()}`;

    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 60px; object-fit: cover; border-radius: 2px;" />
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <div style="font-weight: bold; color: #1C1917;">${item.name}</div>
          <div style="font-size: 11px; color: #666;">Size: ${item.size}</div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #666;">x${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #1C1917;">₹${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    const paymentInfo = order.isPaid
      ? `<span style="color: #4A7C59; font-weight: bold;">PAID (via ${order.paymentMethod.toUpperCase()})</span>`
      : `<span style="color: #C0392B; font-weight: bold;">PENDING (Method: ${order.paymentMethod.toUpperCase()})</span>`;

    const message = `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E5E5E5; background-color: #FAF7F2; color: #1C1917;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="font-family: 'Cormorant Garamond', serif; color: #1C1917; letter-spacing: 3px; font-weight: normal; margin: 0;">VELOUR</h1>
          <p style="font-size: 10px; color: #8B6F5C; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Luxury Artisanal Fashion</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 4px; border: 1px solid #eee;">
          <p style="margin-top: 0; font-size: 15px;">Hello <strong>${user.name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5; color: #444;">${title === 'Order Confirmed' ? 'Thank you for your order! Your payment has been successfully processed.' : `Your order status has been updated to <strong>${order.deliveryStatus.toUpperCase()}</strong>.`}</p>
          
          <div style="background: #1C1917; color: #C4A882; padding: 12px; text-align: center; border-radius: 2px; margin: 20px 0; font-size: 12px; font-weight: bold; letter-spacing: 1px;">
            ORDER ID: #${order._id.toString().slice(-6).toUpperCase()}
          </div>

          <h3 style="border-bottom: 2px solid #FAF7F2; padding-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8B6F5C;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>

          <div style="margin-top: 25px; padding: 20px; background: #FAF7F2; border-radius: 2px; border: 1px solid #E5E5E5;">
            <table style="width: 100%; font-size: 13px; border-spacing: 0 8px;">
              <tr>
                <td style="color: #666;">Subtotal</td>
                <td style="text-align: right; color: #1C1917;">₹${order.itemsPrice.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #666;">Shipping</td>
                <td style="text-align: right; color: #1C1917;">+₹${order.shippingPrice.toLocaleString()}</td>
              </tr>
              ${order.discount > 0 ? `<tr><td style="color: #4A7C59; font-weight: bold;">Promo Discount</td><td style="text-align: right; color: #4A7C59; font-weight: bold;">-₹${order.discount.toLocaleString()}</td></tr>` : ''}
              <tr style="font-size: 16px; font-weight: bold;">
                <td style="padding-top: 15px; border-top: 1px solid #E5E5E5; color: #1C1917;">Total Amount</td>
                <td style="padding-top: 15px; border-top: 1px solid #E5E5E5; text-align: right; color: #1C1917;">₹${order.totalPrice.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding-top: 8px; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Payment Method</td>
                <td style="padding-top: 8px; text-align: right; font-size: 11px;">${paymentInfo}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.CLIENT_URL}/profile?tab=orders" style="display: inline-block; background: #1C1917; color: #FAF7F2; padding: 14px 30px; text-decoration: none; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border-radius: 2px; box-shadow: 0 4px 0 #C4A882;">View & Track Order</a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #8B6F5C; line-height: 1.6;">
          <p style="margin-bottom: 5px;">Need assistance? We're here for you.</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} VELOUR LUXE. Handcrafted with precision.</p>
        </div>
      </div>
    `;
    await sendEmail({ email: user.email, subject, message });
  } catch (error) {
    console.error("Order Email Error:", error);
  }
};

// ── @route  POST /api/orders/create-razorpay-order ───────────
// Step 1: Create Razorpay order_id from backend
const createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  const options = {
    amount: Math.round(amount * 100), // Razorpay expects paise (1 INR = 100 paise)
    currency,
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: req.user._id.toString(),
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.json({
    success: true,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
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
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
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
    user: req.user._id,
    orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    discount: discount || 0,
    promoCode,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    paymentStatus: 'paid',
    isPaid: true,
    paidAt: new Date(),
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

  // ── Send Confirmation Email ──
  await sendOrderEmail(order, req.user, 'Order Confirmed');

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

  // ── Notify User via Email ──
  const userObj = await User.findById(order.user);
  if (userObj) {
    await sendOrderEmail(order, userObj, `Order Updated: ${deliveryStatus.toUpperCase()}`);
  }

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
    user: req.user._id,
    orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    isPaid: false,
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

  // ── Send Confirmation Email ──
  await sendOrderEmail(order, req.user, 'Order Received (COD)');

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
