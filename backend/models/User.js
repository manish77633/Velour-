const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label:    { type: String, default: 'Home' },
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
  country:  { type: String, default: 'India' },
  isDefault:{ type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type:     String,
      minlength: [6, 'Password must be at least 6 characters'],
      select:   false,   // never return password in queries
    },
    googleId:       { type: String },
    profilePicture: { type: String, default: '' },
    phone:          { type: String, default: '' },
    role:           { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified:     { type: Boolean, default: false },
    addresses:      [addressSchema],
    orderHistory:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    wishlist:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt    = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
