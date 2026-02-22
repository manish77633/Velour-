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
      <section className="min-h-screen relative flex items-center py-20 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1C1917 0%, #12100F 100%)' }}>
        
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="g-dark" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(196,168,130,0.05)" strokeWidth="0.6"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#g-dark)"/>
          </svg>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.12) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.08) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center lg:text-left">
            <motion.p variants={fadeUpItem} className="flex items-center justify-center lg:justify-start gap-3 text-[10px] md:text-xs tracking-[0.28em] uppercase mb-6" style={{ color: '#C4A882' }}>
              <span className="w-8 h-px" style={{ background: '#C4A882' }} />
              New Collection 2026
            </motion.p>
            
            <motion.h1 variants={fadeUpItem} className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-6" style={{ color: '#FAF7F2', fontFamily: 'Cormorant Garamond, serif' }}>
              Dress with<br />
              <em className="italic pr-2" style={{ color: '#C4A882' }}>Purpose</em><br />
              & Precision
            </motion.h1>
            
            <motion.p variants={fadeUpItem} className="text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0" style={{ color: '#A3968A', fontWeight: 300 }}>
              Curated fashion for Men, Women & Kids. Premium fabrics, timeless silhouettes, and designs that speak without words.
            </motion.p>
            
            <motion.div variants={fadeUpItem} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop" className="relative overflow-hidden inline-flex items-center justify-center py-4 px-8 rounded-sm transition-all duration-300 group hover:scale-105" style={{ background: '#C4A882', color: '#1C1917' }}>
                <span className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none group-hover:animate-[shine_1.5s_infinite]" />
                <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-widest uppercase font-bold">
                  Shop Collection
                  <FiArrowRight size={16} />
                </span>
              </Link>
              <Link to="/shop?category=Women" className="relative overflow-hidden inline-flex items-center justify-center py-4 px-8 rounded-sm transition-all duration-300 group hover:scale-105 border" style={{ borderColor: 'rgba(196,168,130,0.3)', color: '#FAF7F2' }}>
                <span className="absolute inset-0 bg-[#C4A882] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-widest uppercase font-bold">
                  Women's Edit
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative h-[400px] md:h-[520px] hidden lg:block">
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute right-12 top-0 w-64 h-[420px] z-10">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800" className="w-full h-full object-cover rounded-sm border border-white/5" alt="Men" />
            </motion.div>
            <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute left-8 bottom-4 w-52 h-64 z-30 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800" className="w-full h-full object-cover rounded-sm border-4" style={{ borderColor: '#1C1917' }} alt="Women" />
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
        className="py-24 md:py-32 overflow-hidden" style={{ background: '#FAF7F2' }}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.label} variants={fadeUpItem}>
                <Link to={`/shop?category=${cat.query}`} className="group relative overflow-hidden rounded-sm cursor-pointer block h-[400px] md:h-[500px] shadow-sm hover:shadow-2xl transition-shadow duration-500">
                  <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-[1.5s] group-hover:scale-105" />
                  
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 z-10" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                    <h3 className="text-4xl md:text-5xl font-light text-white mb-2 tracking-wide transform transition-transform duration-500 group-hover:-translate-y-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {cat.label}
                    </h3>
                    <p className="text-[10px] tracking-[0.3em] font-bold uppercase text-white/80">{cat.sub}</p>
                  </div>

                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full border flex items-center justify-center text-white z-20 shadow-lg opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}>
                    <FiArrowRight size={18} className="-rotate-45" />
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
        className="py-24 md:py-32" style={{ background: '#23201E' }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          
          <motion.div variants={fadeUpItem} className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-3" style={{ color: '#C4A882' }}>Trending Now</p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ color: '#FAF7F2', fontFamily: 'Cormorant Garamond, serif' }}>New Arrivals</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase transition-colors group" style={{ color: '#A3968A' }}>
              <span className="group-hover:text-[#C4A882] transition-colors">See All</span> 
              <span className="transform transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#C4A882]"><FiArrowRight size={13} /></span>
            </Link>
          </motion.div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <motion.div key={p._id} variants={fadeUpItem}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div variants={fadeUpItem} className="text-center mt-12">
            <Link to="/shop" className="relative overflow-hidden inline-flex items-center justify-center py-4 px-10 rounded-sm transition-all duration-300 group hover:scale-105" style={{ background: '#C4A882', color: '#1C1917' }}>
              <span className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none group-hover:animate-[shine_1.5s_infinite]" />
              <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-widest uppercase font-bold">
                Shop All Products
                <FiArrowRight size={16} />
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
          <motion.div variants={fadeUpItem} className="rounded-sm px-6 md:px-14 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative overflow-hidden" style={{ background: '#12100F', border: '1px solid rgba(196,168,130,0.15)' }}>
            
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute right-0 top-0 w-64 h-64 rounded-full blur-[100px]" style={{ background: 'rgba(196,168,130,0.1)' }} />
            </div>
            
            <div className="relative z-10 text-center lg:text-left">
              <p className="text-[10px] tracking-[0.25em] uppercase mb-4 font-bold" style={{ color: '#C4A882' }}>Limited Time Offer</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight mb-4" style={{ color: '#FAF7F2', fontFamily: 'Cormorant Garamond, serif' }}>
                Up to <em className="italic pr-2" style={{ color: '#C4A882' }}>50% Off</em><br />Summer Sale
              </h2>
              <p className="text-sm mb-8 leading-relaxed max-w-sm mx-auto lg:mx-0" style={{ color: '#A3968A' }}>
                Shop premium fashion at unbelievable prices. Limited stock — grab yours before it's gone.
              </p>
              
              <Link to="/shop" className="relative overflow-hidden inline-flex items-center justify-center py-4 px-8 rounded-sm transition-all duration-300 group hover:scale-105" style={{ background: '#C4A882', color: '#1C1917' }}>
                <span className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none group-hover:animate-[shine_1.5s_infinite]" />
                <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-widest uppercase font-bold">
                  Shop The Sale
                  <FiArrowRight size={16} />
                </span>
              </Link>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4 relative z-10">
              <div className="rounded-sm aspect-[3/4] overflow-hidden transition-transform duration-500 hover:-rotate-2 border" style={{ borderColor: 'rgba(196,168,130,0.2)' }}>
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80" alt="Summer Sale Men" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="rounded-sm aspect-[3/4] mt-8 overflow-hidden transition-transform duration-500 hover:rotate-2 border" style={{ borderColor: 'rgba(196,168,130,0.2)' }}>
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" alt="Summer Sale Women" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>
            
          </motion.div>
        </div>
      </motion.section>

    </main>
  );
}