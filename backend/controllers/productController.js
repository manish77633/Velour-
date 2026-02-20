const Product = require('../models/Product');

// ── @route   GET /api/products ───────────────────────────────
// Query: category, size, color, minPrice, maxPrice, search, sort, page, limit, featured
const getProducts = async (req, res) => {
  const {
    category, size, color, minPrice, maxPrice,
    search, sort, page = 1, limit = 12, featured,
  } = req.query;

  const filter = { isActive: true };

  // Category filter
  if (category && category !== 'All') filter.category = category;

  // Featured filter
  if (featured === 'true') filter.isFeatured = true;

  // Size filter
  if (size) filter.sizes = { $in: [size] };

  // Color filter
  if (color) filter.colors = { $in: [color] };

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Text search
  if (search) {
    filter.$text = { $search: search };
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // default: newest
  if (sort === 'price_low')   sortOption = { price: 1 };
  if (sort === 'price_high')  sortOption = { price: -1 };
  if (sort === 'rating')      sortOption = { averageRating: -1 };
  if (sort === 'popular')     sortOption = { numReviews: -1 };

  const pageNum  = Number(page);
  const limitNum = Number(limit);
  const skip     = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success:    true,
    products,
    page:       pageNum,
    totalPages: Math.ceil(total / limitNum),
    total,
  });
};

// ── @route   GET /api/products/:id ──────────────────────────
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'reviews.user', 'name profilePicture'
  );

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, product });
};

// ── @route   POST /api/products  (Admin only) ────────────────
const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
};

// ── @route   PUT /api/products/:id  (Admin only) ─────────────
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, product });
};

// ── @route   DELETE /api/products/:id  (Admin only) ──────────
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
};

// ── @route   POST /api/products/:id/reviews  (Protected) ─────
const addReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
  }

  const review = {
    user:    req.user._id,
    name:    req.user.name,
    avatar:  req.user.profilePicture,
    rating:  Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.calcAverageRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added successfully' });
};

// ── @route   DELETE /api/products/:id/reviews/:reviewId ──────
const deleteReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId
  );
  product.calcAverageRating();
  await product.save();

  res.json({ success: true, message: 'Review deleted' });
};

module.exports = {
  getProducts, getProductById, createProduct,
  updateProduct, deleteProduct, addReview, deleteReview,
};
