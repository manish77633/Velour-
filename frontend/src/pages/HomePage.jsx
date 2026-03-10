import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/Loader';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiStar } from 'react-icons/fi';
import TestimonialsMarquee from '../components/TestimonialsMarquee';
import { motion } from 'framer-motion';

// ── Shared Animation Variants (Repeatable Bottom-to-Up) ────────
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

// ── Data ───────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Men', sub: '142 Styles', query: 'Men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80' },
  { label: 'Women', sub: '218 Styles', query: 'Women', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800' },
  { label: 'Kids', sub: '96 Styles', query: 'Kids', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80' },
];

const VALUE_PROPS = [
  { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: FiShield, title: 'Secure Payments', desc: 'Razorpay 256-bit SSL' },
  { icon: FiStar, title: 'Premium Quality', desc: 'Curated sustainable fabrics' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((s) => s.product);

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 8 }));
  }, [dispatch]);

  return (
    <main className="pt-16 overflow-x-hidden w-full max-w-[100vw]" style={{ backgroundColor: '#1C1917' }}>

      {/* Premium Font Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');
        ::selection { background: rgba(196,168,130,0.3); color: #FAF7F2; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* ══════════════════════════════════════════════
          HERO — Deep Dark Luxury (Steady)
      ══════════════════════════════════════════════ */}
      <section className="min-h-screen relative flex items-center py-20 overflow-hidden">

        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2000&q=95"
            className="w-full h-full object-cover object-[center_30%]"
            alt="Hero Background"
          />
          {/* Smart Gradient: Darker on left for content visibility, bright on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
        </div>

        <div className="absolute inset-0 pointer-events-none z-10">
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="g-dark" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#g-dark)" />
          </svg>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full relative z-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-left flex flex-col items-start justify-center max-w-3xl"
          >
            <motion.p variants={fadeUpItem} className="flex items-center gap-3 text-[10px] md:text-xs tracking-[0.4em] uppercase mb-8" style={{ color: '#C4A882' }}>
              <span className="w-12 h-px" style={{ background: '#C4A882' }} />
              Aurelia Luxe &bull; New Arrival
            </motion.p>

            <motion.h1 variants={fadeUpItem} className="text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-8" style={{ color: '#FAF7F2', fontFamily: 'Cormorant Garamond, serif' }}>
              Defining <em className="italic" style={{ color: '#C4A882' }}>True</em><br />
              Elegance
            </motion.h1>

            <motion.p variants={fadeUpItem} className="text-sm md:text-lg leading-relaxed mb-12 max-w-xl" style={{ color: '#FAF7F2', fontWeight: 300, opacity: 0.9 }}>
              Experience the pinnacle of curated fashion. Premium fabrics, timeless silhouettes, and designs crafted for those who demand excellence.
            </motion.p>

            <motion.div variants={fadeUpItem} className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-[#C4A882] px-12 py-5 font-bold text-[#1C1917] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(196,168,130,0.5)]"
              >
                <div className="absolute top-0 -left-[100%] h-full w-full -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
                <span className="relative z-10 flex items-center gap-2.5 text-xs uppercase tracking-[0.25em]">
                  Explore Shop
                  <FiArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <Link to="/shop?category=Women" className="relative overflow-hidden inline-flex items-center justify-center py-5 px-10 rounded-sm transition-all duration-300 group hover:scale-105 border backdrop-blur-sm shadow-xl" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FAF7F2' }}>
                <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase font-bold">
                  Women's Edit
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="py-3 overflow-hidden whitespace-nowrap" style={{ background: '#C4A882' }}>
        <div className="inline-flex animate-marquee gap-12">
          {[...Array(2)].map((_, idx) => (
            <React.Fragment key={idx}>
              {['Free Shipping Above ₹999', 'New Summer Collection', 'Premium Quality Fabrics', 'Easy 30-Day Returns', 'Exclusive Member Offers'].map((t) => (
                <span key={t} className="inline-flex items-center gap-3 text-xs tracking-[0.22em] uppercase font-bold" style={{ color: '#1C1917' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1C1917' }} />
                  {t}
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CATEGORIES — Light Cream Theme (#FAF7F2) 🤍
      ══════════════════════════════════════════════ */}
      {/* 💡 FIX: viewport={{ once: true }} */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        className="py-24 md:py-24 overflow-hidden" style={{ background: '#FAF7F2' }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">

          <motion.div variants={fadeUpItem} className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[1px]" style={{ background: '#8B6F5C' }}></span>
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: '#8B6F5C' }}>Explore</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight" style={{ color: '#1C1917', fontFamily: 'Cormorant Garamond, serif' }}>Shop by Category</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase transition-colors group" style={{ color: '#6A5848' }}>
              <span className="group-hover:text-[#1C1917] transition-colors">View All</span>
              <span className="transform transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#1C1917]"><FiArrowRight size={14} /></span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.label} variants={fadeUpItem} className="group cursor-pointer">
                <Link to={`/shop?category=${cat.query}`} className="block relative">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#E5E7EB]">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                    {/* Soft Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>

                  {/* Content below image for a cleaner, "Editorial" look */}
                  <div className="mt-8 flex flex-col items-center text-center">
                    <span className="text-[9px] tracking-[0.5em] uppercase text-[#8B6F5C] font-bold mb-3 block">
                      {cat.sub}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-light text-[#1C1917] mb-5 tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {cat.label}
                    </h3>

                    {/* Minimal Animated Line */}
                    <div className="relative h-[1px] w-10 bg-[#C4A882]/30 overflow-hidden">
                      <div className="absolute inset-0 bg-[#8B6F5C] -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          FEATURED PRODUCTS — Muted Dark (#23201E) 🖤
      ══════════════════════════════════════════════ */}
      {/* 💡 FIX: viewport={{ once: true }} ensures products load correctly on mobile */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        className="py-12 md:py-12 relative overflow-hidden"
        style={{ background: '#FAF7F2' }}
      >
        {/* Subtle Decorative Background Texture/Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #C4A882 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, #8B6F5C 0%, transparent 70%)' }} />

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative z-10">

          <motion.div variants={fadeUpItem} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <span className="w-12 h-[1px] bg-[#8B6F5C]" />
                <p className="text-[10px] tracking-[0.5em] uppercase font-bold" style={{ color: '#8B6F5C' }}>The Curated Edit</p>
              </div>
              <h2 className="text-5xl md:text-7xl font-light text-[#1C1917] leading-none" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                New <em className="italic" style={{ color: '#8B6F5C' }}>Arrivals</em>
              </h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-4 text-[10px] font-bold tracking-[0.3em] uppercase text-[#6A5848] transition-all hover:text-[#1C1917]">
              Explore Complete Collection
              <div className="w-10 h-10 rounded-full border border-[#8B6F5C]/30 flex items-center justify-center group-hover:border-[#1C1917] group-hover:bg-[#1C1917] group-hover:text-[#FAF7F2] transition-all">
                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((p) => (
                <motion.div key={p._id} variants={fadeUpItem}>
                  <ProductCard product={p} isDark={false} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div variants={fadeUpItem} className="mt-20 flex justify-center">
            <Link to="/shop" className="relative group overflow-hidden px-16 py-5 rounded-sm border border-[#8B6F5C]/30 text-[#1C1917] transition-all hover:border-[#1C1917]">
              <span className="absolute inset-0 bg-[#1C1917] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-[10px] tracking-[0.4em] uppercase font-bold group-hover:text-[#FAF7F2] transition-colors">
                View All Arrivals
              </span>
            </Link>
          </motion.div>

        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS (Dark background continuity)
      ══════════════════════════════════════════════ */}
      {/* 💡 FIX: viewport={{ once: true }} */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpItem}>
        <TestimonialsMarquee />
      </motion.div>

      {/* ══════════════════════════════════════════════
          VALUE PROPS — Warm Off-White (#EDE8DF) 🤍
      ══════════════════════════════════════════════ */}
      {/* 💡 FIX: viewport={{ once: true }} */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        className="py-16 md:py-24" style={{ background: '#EDE8DF' }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUpItem} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-500 hover:scale-110" style={{ background: '#FFFFFF', border: '1px solid rgba(139,111,92,0.15)' }}>
                  <Icon size={22} style={{ color: '#8B6F5C' }} />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1 tracking-wide" style={{ color: '#1C1917' }}>{title}</p>
                  <p className="text-xs" style={{ color: '#6A5848' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SALE BANNER — Deep Dark Theme (#1C1917) 🖤
      ══════════════════════════════════════════════ */}
      {/* 💡 FIX: viewport={{ once: true }} */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        className="py-16 md:py-24 px-4 md:px-6" style={{ background: '#1C1917' }}
      >
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUpItem} className="rounded-sm px-6 md:px-14 py-20 flex flex-col items-center text-center relative overflow-hidden" style={{ background: '#12100F', border: '1px solid rgba(196,168,130,0.15)' }}>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute right-0 top-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'rgba(196,168,130,0.08)' }} />
              <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full blur-[100px]" style={{ background: 'rgba(196,168,130,0.05)' }} />
            </div>

            <div className="relative z-10 max-w-2xl">
              <p className="text-[10px] tracking-[0.4em] uppercase mb-6 font-bold" style={{ color: '#C4A882' }}>Exclusive Seasonal Offer</p>
              <h2 className="text-5xl md:text-7xl font-light leading-tight mb-6" style={{ color: '#FAF7F2', fontFamily: 'Cormorant Garamond, serif' }}>
                Up to <em className="italic" style={{ color: '#C4A882' }}>50% Off</em><br />Summer Collection
              </h2>
              <p className="text-sm md:text-base mb-10 leading-relaxed opacity-80" style={{ color: '#FAF7F2', fontWeight: 300 }}>
                Step into the season with premium fashion at impossible prices. Our curated summer collection is now available with exclusive member benefits.
              </p>

              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-[#C4A882] px-12 py-5 font-bold text-[#1C1917] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(196,168,130,0.4)]"
              >
                <div className="absolute top-0 -left-[100%] h-full w-full -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
                <span className="relative z-10 flex items-center gap-2.5 text-xs uppercase tracking-[0.25em]">
                  Shop the Sale Now
                  <FiArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

          </motion.div>
        </div>
      </motion.section>

    </main>
  );
}