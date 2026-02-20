// backend/seeder.js
// Run: node seeder.js        → adds sample products + admin user
// Run: node seeder.js -d     → clears all data

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const User     = require('./models/User');
const Product  = require('./models/Product');
const Order    = require('./models/Order');

dotenv.config();

const SAMPLE_PRODUCTS = [
  {
    name: 'Classic Linen Shirt',
    description: 'Premium linen shirt crafted for the modern man. Breathable fabric perfect for all seasons. Features a relaxed fit with subtle texture.',
    price: 2499, originalPrice: 3499,
    category: 'Men', subCategory: 'Shirts',
    sizes: ['S','M','L','XL','XXL'],
    colors: ['#1C1917','#FAF7F2','#8B6F5C'],
    stockQuantity: 50, isFeatured: true,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600'],
    tags: ['linen','casual','summer'],
    averageRating: 4.5, numReviews: 24,
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Versatile slim-fit chinos that transition effortlessly from office to evening. Made from premium stretch cotton blend.',
    price: 2199, originalPrice: 2999,
    category: 'Men', subCategory: 'Trousers',
    sizes: ['S','M','L','XL','XXL'],
    colors: ['#8B6F5C','#1C1917','#4A6FA5','#EDE8DF'],
    stockQuantity: 35, isFeatured: true,
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'],
    tags: ['chinos','office','casual'],
    averageRating: 4.3, numReviews: 18,
  },
  {
    name: 'Hooded Sweatshirt',
    description: 'Ultra-soft fleece hoodie for ultimate comfort. Kangaroo pocket, adjustable drawstring, and ribbed cuffs for a premium feel.',
    price: 1899, originalPrice: null,
    category: 'Men', subCategory: 'Sweatshirts',
    sizes: ['S','M','L','XL','XXL'],
    colors: ['#1C1917','#4A6FA5','#6B8F71'],
    stockQuantity: 60,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'],
    tags: ['hoodie','casual','winter'],
    averageRating: 4.6, numReviews: 31,
  },
  {
    name: 'Floral Wrap Dress',
    description: 'Elegant floral wrap dress in lightweight chiffon. Adjustable tie waist and flutter sleeves make it perfect for any occasion.',
    price: 3299, originalPrice: 4999,
    category: 'Women', subCategory: 'Dresses',
    sizes: ['XS','S','M','L'],
    colors: ['#C0392B','#4A6FA5','#1C1917'],
    stockQuantity: 30, isFeatured: true,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'],
    tags: ['floral','dress','party','summer'],
    averageRating: 4.7, numReviews: 42,
  },
  {
    name: 'Silk Blouse',
    description: 'Luxurious silk blouse with a relaxed silhouette. Versatile piece that pairs beautifully with both formal and casual bottoms.',
    price: 2799, originalPrice: 3999,
    category: 'Women', subCategory: 'Tops',
    sizes: ['XS','S','M','L','XL'],
    colors: ['#EDE8DF','#C4A882','#1C1917','#C0392B'],
    stockQuantity: 25, isFeatured: true,
    images: ['https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600'],
    tags: ['silk','formal','office'],
    averageRating: 4.8, numReviews: 56,
  },
  {
    name: 'Pleated Midi Skirt',
    description: 'Flowing pleated midi skirt in premium crepe fabric. Features an elasticated waistband for all-day comfort.',
    price: 2499, originalPrice: null,
    category: 'Women', subCategory: 'Skirts',
    sizes: ['XS','S','M','L'],
    colors: ['#1C1917','#EDE8DF','#8B6F5C'],
    stockQuantity: 40, isFeatured: false,
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600'],
    tags: ['skirt','elegant','office'],
    averageRating: 4.4, numReviews: 22,
  },
  {
    name: 'High-Waist Trousers',
    description: 'Tailored high-waist trousers with a wide-leg silhouette. Crafted from premium wool blend for a sharp, professional look.',
    price: 3199, originalPrice: 4499,
    category: 'Women', subCategory: 'Trousers',
    sizes: ['XS','S','M','L','XL'],
    colors: ['#1C1917','#8B6F5C','#4A6FA5'],
    stockQuantity: 20,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4a6774?w=600'],
    tags: ['trousers','formal','office'],
    averageRating: 4.5, numReviews: 29,
  },
  {
    name: 'Cotton Kurta Set',
    description: 'Traditional cotton kurta with matching pants. Hand-block printed with natural dyes. Perfect for festive occasions.',
    price: 2899, originalPrice: 3999,
    category: 'Women', subCategory: 'Ethnic',
    sizes: ['XS','S','M','L','XL'],
    colors: ['#C4A882','#C0392B','#1C1917'],
    stockQuantity: 45, isFeatured: true,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
    tags: ['kurta','ethnic','festive','cotton'],
    averageRating: 4.9, numReviews: 67,
  },
  {
    name: 'Kids Summer Set',
    description: 'Comfortable and colourful summer set for active kids. Made from 100% organic cotton, gentle on sensitive skin.',
    price: 1299, originalPrice: null,
    category: 'Kids', subCategory: 'Sets',
    sizes: ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y'],
    colors: ['#6B8F71','#4A6FA5','#C0392B'],
    stockQuantity: 80, isFeatured: true,
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600'],
    tags: ['kids','summer','organic','casual'],
    averageRating: 4.9, numReviews: 44,
  },
  {
    name: 'Girls Party Frock',
    description: 'Beautiful princess-style party frock with layers of tulle. Perfect for birthdays and special celebrations.',
    price: 1599, originalPrice: 2199,
    category: 'Kids', subCategory: 'Dresses',
    sizes: ['3-4Y','5-6Y','7-8Y','9-10Y'],
    colors: ['#C4A882','#C0392B','#9B59B6'],
    stockQuantity: 35, isFeatured: false,
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600'],
    tags: ['kids','party','dress','festive'],
    averageRating: 4.7, numReviews: 38,
  },
  {
    name: 'Boys Denim Jacket',
    description: 'Classic denim jacket for boys. Durable construction with chest pockets and adjustable cuffs. Goes with everything.',
    price: 1799, originalPrice: 2499,
    category: 'Kids', subCategory: 'Jackets',
    sizes: ['4-5Y','6-7Y','8-9Y','10-11Y'],
    colors: ['#4A6FA5','#1C1917'],
    stockQuantity: 55,
    images: ['https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=600'],
    tags: ['kids','denim','jacket','casual'],
    averageRating: 4.6, numReviews: 27,
  },
  {
    name: 'Printed T-Shirt',
    description: 'Graphic printed tee in premium combed cotton. Relaxed fit with a crew neck. Available in multiple fun prints.',
    price: 899, originalPrice: null,
    category: 'Men', subCategory: 'T-Shirts',
    sizes: ['S','M','L','XL','XXL'],
    colors: ['#FAF7F2','#1C1917','#6B8F71'],
    stockQuantity: 100,
    images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600'],
    tags: ['tshirt','casual','graphic','summer'],
    averageRating: 4.2, numReviews: 89,
  },
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected → ecommerce_db');
};

const seedDB = async () => {
  await connectDB();

  if (process.argv[2] === '-d') {
    // ── DESTROY MODE ──────────────────────────────────────
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  All data cleared');
    process.exit(0);
  }

  // ── SEED MODE ────────────────────────────────────────────
  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@velour.com' });
  if (!adminExists) {
    await User.create({
      name:       'Manish Kumar',
      email:      'admin@velour.com',
      password:   'admin123',   // change after first login!
      role:       'admin',
      isVerified: true,
    });
    console.log('👤 Admin user created → admin@velour.com / admin123');
  } else {
    console.log('👤 Admin user already exists');
  }

  // Insert products
  await Product.deleteMany({});
  const inserted = await Product.insertMany(SAMPLE_PRODUCTS);
  console.log(`✅ ${inserted.length} sample products added to ecommerce_db`);

  console.log('\n🚀 Seeding complete! Run your server and visit /shop\n');
  process.exit(0);
};

seedDB().catch((err) => {
  console.error('❌ Seeder error:', err);
  process.exit(1);
});