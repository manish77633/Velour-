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
  // ==========================
  // WOMEN'S CATEGORY (10 Items)
  // ==========================
  {
    name: 'Emerald Silk Lehenga',
    description: 'Heavy silk lehenga with mirror work and hand-stitched embroidery for a regal look.',
    price: 12499, originalPrice: 18000,
    category: 'Women', subCategory: 'Ethnic',
    sizes: ['M', 'L', 'XL'], colors: ['#043927', '#FFD700'],
    stockQuantity: 10, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1599032909756-5dee8c65c699?w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
    ],
    tags: ['lehenga', 'wedding', 'ethnic'], averageRating: 4.9, numReviews: 45
  },
  {
    name: 'Satin Slip Dress',
    description: 'Minimalist champagne-colored satin slip dress with a cowl neck and cross-back straps.',
    price: 2499, originalPrice: 3999,
    category: 'Women', subCategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['#F7E7CE', '#1C1917'],
    stockQuantity: 25, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800'
    ],
    tags: ['satin', 'dress', 'minimalist'], averageRating: 4.6, numReviews: 32
  },
  {
    name: 'Oversized Wool Blazer',
    description: 'Tailored oversized blazer made from premium wool blend. Perfect for a chic office look.',
    price: 4999, originalPrice: 6500,
    category: 'Women', subCategory: 'Office',
    sizes: ['S', 'M', 'L'], colors: ['#8B6F5C', '#1C1917'],
    stockQuantity: 15, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4a6774?w=800',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800'
    ],
    tags: ['blazer', 'office', 'formal'], averageRating: 4.8, numReviews: 21
  },
  {
    name: 'Hand-Painted Organza Saree',
    description: 'Lightweight organza saree with hand-painted floral motifs and a scalloped border.',
    price: 6999, originalPrice: 9500,
    category: 'Women', subCategory: 'Saree',
    sizes: ['Free Size'], colors: ['#FAF7F2', '#FFB6C1'],
    stockQuantity: 12, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469668-935142b96de4?w=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
    ],
    tags: ['organza', 'saree', 'floral'], averageRating: 4.9, numReviews: 18
  },
  {
    name: 'Denim Midi Skirt',
    description: 'High-waisted denim midi skirt with a front slit and vintage wash finish.',
    price: 1899, originalPrice: 2999,
    category: 'Women', subCategory: 'Skirts',
    sizes: ['26', '28', '30', '32'], colors: ['#4A6FA5'],
    stockQuantity: 30, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1582142306909-195724d339c4?w=800',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800'
    ],
    tags: ['denim', 'skirt', 'vintage'], averageRating: 4.4, numReviews: 27
  },
  {
    name: 'Cashmere Turtleneck',
    description: 'Ultra-soft 100% cashmere turtleneck sweater for ultimate winter luxury.',
    price: 3499, originalPrice: 5500,
    category: 'Women', subCategory: 'Knitwear',
    sizes: ['S', 'M', 'L'], colors: ['#EDE8DF', '#1C1917'],
    stockQuantity: 20, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800'
    ],
    tags: ['cashmere', 'winter', 'knitwear'], averageRating: 4.7, numReviews: 15
  },
  {
    name: 'Lace Evening Blouse',
    description: 'Delicate lace blouse with sheer sleeves and a silk camisole lining.',
    price: 1599, originalPrice: 2499,
    category: 'Women', subCategory: 'Tops',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['#1C1917', '#FFFFFF'],
    stockQuantity: 22, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'
    ],
    tags: ['lace', 'tops', 'party'], averageRating: 4.5, numReviews: 12
  },
  {
    name: 'Linen Wide-Leg Trousers',
    description: 'Breathable high-waist linen trousers with a relaxed fit and side pockets.',
    price: 2199, originalPrice: 3200,
    category: 'Women', subCategory: 'Trousers',
    sizes: ['28', '30', '32', '34'], colors: ['#FAF7F2', '#8B6F5C'],
    stockQuantity: 18, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4a6774?w=800',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'
    ],
    tags: ['linen', 'summer', 'trousers'], averageRating: 4.3, numReviews: 10
  },
  {
    name: 'Cotton Wrap Kurti',
    description: 'Contemporary wrap-style kurti made from hand-block printed indigo cotton.',
    price: 1299, originalPrice: 1999,
    category: 'Women', subCategory: 'Ethnic',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['#000080'],
    stockQuantity: 40, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800'
    ],
    tags: ['indigo', 'kurti', 'ethnic'], averageRating: 4.7, numReviews: 55
  },
  {
    name: 'Velvet Evening Clutches',
    description: 'Elegant velvet clutch with a gold chain strap, perfect for festive pairings.',
    price: 999, originalPrice: 1599,
    category: 'Women', subCategory: 'Accessories',
    sizes: ['Standard'], colors: ['#800000', '#1C1917'],
    stockQuantity: 50, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
    ],
    tags: ['clutch', 'festive', 'velvet'], averageRating: 4.8, numReviews: 30
  },

  // ==========================
  // MEN'S CATEGORY (10 Items)
  // ==========================
  {
    name: 'Tailored Tuxedo Jacket',
    description: 'Sharp black tuxedo with satin lapels for high-stakes formal events.',
    price: 7999, originalPrice: 12000,
    category: 'Men', subCategory: 'Formal',
    sizes: ['38', '40', '42', '44'], colors: ['#1C1917'],
    stockQuantity: 10, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4a6774?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'
    ],
    tags: ['tuxedo', 'formal', 'wedding'], averageRating: 4.9, numReviews: 14
  },
  {
    name: 'Raw Denim Jacket',
    description: 'Heavyweight raw denim jacket with antique brass buttons and double stitching.',
    price: 2999, originalPrice: 4500,
    category: 'Men', subCategory: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['#002366'],
    stockQuantity: 25, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800'
    ],
    tags: ['denim', 'jacket', 'casual'], averageRating: 4.7, numReviews: 38
  },
  {
    name: 'Polo Knitted Shirt',
    description: 'Breathable knitted polo shirt in a slim-fit silhouette for a smart-casual look.',
    price: 1599, originalPrice: 2499,
    category: 'Men', subCategory: 'Shirts',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['#4A6FA5', '#FAF7F2'],
    stockQuantity: 40, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    tags: ['polo', 'knit', 'smart-casual'], averageRating: 4.5, numReviews: 22
  },
  {
    name: 'Beige Cargo Pants',
    description: 'Rugged utility cargo pants with multiple pockets and a reinforced knee area.',
    price: 2199, originalPrice: 3200,
    category: 'Men', subCategory: 'Trousers',
    sizes: ['30', '32', '34', '36'], colors: ['#C4A882'],
    stockQuantity: 30, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4a6774?w=800'
    ],
    tags: ['cargo', 'utility', 'casual'], averageRating: 4.6, numReviews: 45
  },
  {
    name: 'Merino Wool Sweater',
    description: 'Lightweight yet warm merino wool sweater in a classic crew neck design.',
    price: 2799, originalPrice: 4200,
    category: 'Men', subCategory: 'Knitwear',
    sizes: ['M', 'L', 'XL'], colors: ['#1C1917', '#808080'],
    stockQuantity: 20, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800'
    ],
    tags: ['wool', 'winter', 'knitwear'], averageRating: 4.8, numReviews: 12
  },
  {
    name: 'Cuban Collar Printed Shirt',
    description: 'Summer-ready rayon shirt with a vintage Cuban collar and tropical print.',
    price: 1399, originalPrice: 2199,
    category: 'Men', subCategory: 'Shirts',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['#6B8F71'],
    stockQuantity: 50, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    tags: ['summer', 'printed', 'vintage'], averageRating: 4.4, numReviews: 54
  },
  {
    name: 'Checked Flannel Shirt',
    description: 'Heavyweight brushed flannel shirt in a red and black buffalo check pattern.',
    price: 1799, originalPrice: 2599,
    category: 'Men', subCategory: 'Shirts',
    sizes: ['M', 'L', 'XL', 'XXL'], colors: ['#C0392B'],
    stockQuantity: 35, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    tags: ['flannel', 'winter', 'checked'], averageRating: 4.6, numReviews: 29
  },
  {
    name: 'Leather Bomber Jacket',
    description: 'Genuine leather bomber jacket with ribbed cuffs and a premium satin lining.',
    price: 8999, originalPrice: 15000,
    category: 'Men', subCategory: 'Outerwear',
    sizes: ['M', 'L', 'XL'], colors: ['#1C1917', '#8B4513'],
    stockQuantity: 10, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    tags: ['leather', 'jacket', 'luxury'], averageRating: 4.9, numReviews: 10
  },
  {
    name: 'Striped Formal Trousers',
    description: 'Slim-fit pinstriped trousers in a dark charcoal grey wool blend.',
    price: 2499, originalPrice: 3800,
    category: 'Men', subCategory: 'Formal',
    sizes: ['30', '32', '34', '36'], colors: ['#2C3E50'],
    stockQuantity: 20, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4a6774?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'
    ],
    tags: ['pinstripe', 'formal', 'office'], averageRating: 4.5, numReviews: 18
  },
  {
    name: 'Graphic Pop-Art Tee',
    description: '100% heavy cotton tee featuring a unique pop-art graphic on the back.',
    price: 999, originalPrice: 1499,
    category: 'Men', subCategory: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['#FFFFFF', '#1C1917'],
    stockQuantity: 100, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    tags: ['graphic', 'tshirt', 'streetwear'], averageRating: 4.7, numReviews: 82
  },

  // ==========================
  // KIDS' CATEGORY (10 Items)
  // ==========================
  {
    name: 'Velour Tracksuit Set',
    description: 'Super soft and stylish velour tracksuit set for active kids.',
    price: 1999, originalPrice: 2800,
    category: 'Kids', subCategory: 'Sets',
    sizes: ['4-5Y', '6-7Y', '8-9Y'], colors: ['#4A6FA5', '#FFB6C1'],
    stockQuantity: 30, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'
    ],
    tags: ['velour', 'tracksuit', 'comfy'], averageRating: 4.9, numReviews: 15
  },
  {
    name: 'Dinosaur Print Raincoat',
    description: 'Waterproof vibrant yellow raincoat with cute dinosaur spikes on the hood.',
    price: 1299, originalPrice: 1899,
    category: 'Kids', subCategory: 'Outerwear',
    sizes: ['3-4Y', '5-6Y', '7-8Y'], colors: ['#F1C40F'],
    stockQuantity: 40, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'
    ],
    tags: ['raincoat', 'kids', 'waterproof'], averageRating: 4.8, numReviews: 12
  },
  {
    name: 'Sequined Party Dress',
    description: 'Sparkly sequined dress with a soft tulle skirt for little princesses.',
    price: 2499, originalPrice: 3500,
    category: 'Kids', subCategory: 'Dresses',
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'], colors: ['#FF69B4', '#9B59B6'],
    stockQuantity: 20, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800'
    ],
    tags: ['party', 'dress', 'sequin'], averageRating: 4.9, numReviews: 24
  },
  {
    name: 'Animal Ears Fleece Hoodie',
    description: 'Cozy fleece hoodie featuring teddy bear ears on the hood.',
    price: 1499, originalPrice: 2199,
    category: 'Kids', subCategory: 'Sweatshirts',
    sizes: ['2-3Y', '4-5Y', '6-7Y'], colors: ['#8B4513', '#D2B48C'],
    stockQuantity: 45, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'
    ],
    tags: ['fleece', 'hoodie', 'animal'], averageRating: 4.7, numReviews: 31
  },
  {
    name: 'Superhero Pajama Set',
    description: '100% organic cotton pajamas with fun superhero graphics.',
    price: 899, originalPrice: 1399,
    category: 'Kids', subCategory: 'Nightwear',
    sizes: ['3-4Y', '5-6Y', '7-8Y'], colors: ['#002366', '#C0392B'],
    stockQuantity: 60, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'
    ],
    tags: ['pajamas', 'kids', 'cotton'], averageRating: 4.8, numReviews: 44
  },
  {
    name: 'Denim Overalls',
    description: 'Classic denim overalls with adjustable straps and front pocket.',
    price: 1799, originalPrice: 2499,
    category: 'Kids', subCategory: 'Outfits',
    sizes: ['4-5Y', '6-7Y', '8-9Y'], colors: ['#4A6FA5'],
    stockQuantity: 25, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'
    ],
    tags: ['overalls', 'denim', 'kids'], averageRating: 4.6, numReviews: 18
  },
  {
    name: 'Floral Tutu Skirt',
    description: 'Multi-layered tutu skirt with scattered silk flowers inside the tulle.',
    price: 1199, originalPrice: 1799,
    category: 'Kids', subCategory: 'Skirts',
    sizes: ['3-4Y', '5-6Y', '7-8Y'], colors: ['#FADADD'],
    stockQuantity: 35, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800'
    ],
    tags: ['tutu', 'skirt', 'kids'], averageRating: 4.5, numReviews: 22
  },
  {
    name: 'Casual Polo Tee',
    description: 'Cotton blend polo tee with a contrast collar for a smart look.',
    price: 799, originalPrice: 1199,
    category: 'Kids', subCategory: 'T-Shirts',
    sizes: ['5-6Y', '7-8Y', '9-10Y'], colors: ['#2980B9', '#FFFFFF'],
    stockQuantity: 80, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'
    ],
    tags: ['polo', 'tshirt', 'smart'], averageRating: 4.4, numReviews: 14
  },
  {
    name: 'Quilted Puffer Vest',
    description: 'Warm quilted puffer vest to layer over hoodies in chilly weather.',
    price: 1999, originalPrice: 2999,
    category: 'Kids', subCategory: 'Outerwear',
    sizes: ['6-7Y', '8-9Y', '10-11Y'], colors: ['#C0392B', '#1C1917'],
    stockQuantity: 15, isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'
    ],
    tags: ['puffer', 'winter', 'vest'], averageRating: 4.7, numReviews: 10
  },
  {
    name: 'Graphic Skate Tee',
    description: 'Cool graphic tee inspired by urban skate culture for older kids.',
    price: 949, originalPrice: 1499,
    category: 'Kids', subCategory: 'T-Shirts',
    sizes: ['10-11Y', '12-13Y', '14-15Y'], colors: ['#1C1917', '#E74C3C'],
    stockQuantity: 50, isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
      'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=800',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800'
    ],
    tags: ['skate', 'tshirt', 'urban'], averageRating: 4.5, numReviews: 38
  }
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