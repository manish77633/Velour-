const mongoose = require('mongoose');

// ── Review Sub-Schema ───────────────────────────────────────
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    name:    { type: String, required: true },
    avatar:  { type: String, default: '' },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// ── Product Schema ──────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Product name is required'],
      trim:     true,
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
    },
    price: {
      type:     Number,
      required: [true, 'Price is required'],
      min:      [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,  // MRP before discount
    },
    images: {
      type:    [String],
      default: [],
    },
    category: {
      type:     String,
      required: [true, 'Category is required'],
      enum:     ['Men', 'Women', 'Kids'],
    },
    subCategory: {
      type: String,  // e.g., Shirts, Dresses, T-Shirts
      trim: true,
    },
    sizes: {
      type:    [String],
      enum:    ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y', '10-11Y'],
      default: [],
    },
    colors: {
      type:    [String],
      default: [],
    },
    stockQuantity: {
      type:    Number,
      default: 0,
      min:     0,
    },
    sku: {
      type:   String,
      unique: true,
      sparse: true,
    },
    tags:      [String],
    isFeatured:{ type: Boolean, default: false },
    isActive:  { type: Boolean, default: true },

    // ── Reviews ─────────────────────────────────────────────
    reviews:       [reviewSchema],
    numReviews:    { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ── Virtual: discount % ─────────────────────────────────────
productSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// ── Virtual: inStock ────────────────────────────────────────
productSchema.virtual('inStock').get(function () {
  return this.stockQuantity > 0;
});

// ── Method: recalculate ratings ─────────────────────────────
productSchema.methods.calcAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews    = 0;
  } else {
    const total        = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = (total / this.reviews.length).toFixed(1);
    this.numReviews    = this.reviews.length;
  }
};

// ── Indexes ──────────────────────────────────────────────────
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);