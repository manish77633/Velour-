const mongoose = require('mongoose');

// ── Order Item Sub-Schema ───────────────────────────────────
const orderItemSchema = new mongoose.Schema({
  product: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Product',
    required: true,
  },
  name:     { type: String, required: true },
  image:    { type: String },
  price:    { type: Number, required: true },
  size:     { type: String, required: true },
  color:    { type: String },
  quantity: { type: Number, required: true, min: 1 },
});

// ── Shipping Address Sub-Schema ─────────────────────────────
const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
  country:  { type: String, default: 'India' },
});

// ── Order Schema ────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    orderItems:      [orderItemSchema],
    shippingAddress: shippingAddressSchema,

    // ── Pricing ──────────────────────────────────────────────
    itemsPrice:    { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice:      { type: Number, required: true, default: 0 },
    totalPrice:    { type: Number, required: true, default: 0 },
    discount:      { type: Number, default: 0 },

    // ── Razorpay Payment ──────────────────────────────────────
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    // ── Status ────────────────────────────────────────────────
    paymentMethod: {
      type:    String,
      enum:    ['razorpay', 'cod'],
      default: 'razorpay',
    },
    paymentStatus: {
      type:    String,
      enum:    ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    deliveryStatus: {
      type:    String,
      enum:    ['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'processing',
    },

    isPaid:       { type: Boolean, default: false },
    paidAt:       { type: Date },
    isDelivered:  { type: Boolean, default: false },
    deliveredAt:  { type: Date },

    promoCode:    { type: String },
    notes:        { type: String },
  },
  { timestamps: true }
);

// ── Virtual: order number ────────────────────────────────────
orderSchema.virtual('orderNumber').get(function () {
  return `VLR-${this.createdAt.getFullYear()}-${String(this._id).slice(-6).toUpperCase()}`;
});

module.exports = mongoose.model('Order', orderSchema);
