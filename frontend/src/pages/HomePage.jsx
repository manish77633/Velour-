import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/Loader';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiStar } from 'react-icons/fi';
import TestimonialsMarquee from '../components/TestimonialsMarquee';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { 
    label: 'Men', 
    sub: '142 Styles', 
    query: 'Men', 
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    label: 'Women', 
    sub: '218 Styles', 
    query: 'Women', 
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800' 
  },
  { 
    label: 'Kids', 
    sub: '96 Styles', 
    query: 'Kids', 
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80' 
  },
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
    <main className="pt-16">

      {/* ── HERO ── */}
      <section className="min-h-screen bg-dark relative overflow-hidden flex items-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-warm/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-screen-xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20">
          {/* Left */}
          <div className="relative z-10">
            <p className="flex items-center gap-3 text-xs tracking-[0.28em] uppercase text-accent mb-6">
              <span className="w-10 h-px bg-accent" />
              New Collection 2025
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-cream mb-6">
              Dress with<br />
              <em className="text-accent italic">Purpose</em><br />
              & Precision
            </h1>
            <p className="text-sm leading-relaxed text-cream/50 mb-8 max-w-md">
              Curated fashion for Men, Women & Kids. Premium fabrics, timeless silhouettes,
              and designs that speak without words.
            </p>
<div className="flex gap-4 flex-wrap">
  
  {/* 1. Shop Collection Button */}
  <motion.div
    whileHover="hover"
    whileTap="tap"
    variants={{
      hover: { scale: 1.04 },
      tap: { scale: 0.96 }
    }}
  >
    <Link 
      to="/shop" 
      className="relative overflow-hidden inline-flex items-center justify-center btn-primary bg-warm hover:bg-accent py-3.5 px-8 rounded-sm transition-all duration-300 group"
    >
      {/* ✨ Animated Hover Shine Effect ✨ */}
      <motion.span 
        variants={{ hover: { x: ['-100%', '200%'] } }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
      />
      
      {/* Button Text & Icon */}
      <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-widest uppercase font-bold">
        Shop Collection
        {/* Flying Arrow Icon */}
        <motion.svg 
          variants={{ hover: { x: 4, y: -4 } }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"
        >
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </span>
    </Link>
  </motion.div>

  {/* 2. Women's Edit Button */}
  <motion.div
    whileHover="hover"
    whileTap="tap"
    variants={{
      hover: { scale: 1.04 },
      tap: { scale: 0.96 }
    }}
  >
    <Link 
      to="/shop?category=Women"
      className="relative overflow-hidden inline-flex items-center justify-center border border-cream/25 text-cream hover:border-cream hover:bg-cream/5 px-8 py-3.5 rounded-sm transition-all duration-300 group"
    >
      {/* ✨ Animated Hover Shine Effect (Subtle for outline button) ✨ */}
      <motion.span 
        variants={{ hover: { x: ['-100%', '200%'] } }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
      />
      
      {/* Button Text & Icon */}
      <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-widest uppercase font-bold">
        Women's Edit
        {/* Flying Icon */}
        <motion.div variants={{ hover: { x: 4, y: -4 } }}>
          <FiArrowRight size={15} strokeWidth={2.5} />
        </motion.div>
      </span>
    </Link>
  </motion.div>

</div>
            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-cream/10">
              {[['500+', 'Styles'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-semibold text-cream">{num}</p>
                  <p className="text-xs tracking-widest uppercase text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[520px] hidden lg:block border border-cream/20"> {/* Border sirf testing ke liye hai */}

            {/* Men Image (Back) */}
            <div className="absolute right-20 top-10 w-60 h-[380px] z-10 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800"
                className="w-full h-full object-cover rounded-sm"
                alt="Men"
              />
            </div>

            {/* Women Image (Middle) */}
            <div className="absolute left-10 bottom-10 w-44 h-56 z-30  shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800"
                className="w-full h-full object-cover rounded-sm"
                alt="Women"
              />
            </div>

            {/* Child Image (Top) */}

          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-warm py-3 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee gap-12">
          {[...Array(2)].map((_, idx) => (
            <React.Fragment key={idx}>
              {['Free Shipping Above ₹999', 'New Summer Collection', 'Premium Quality Fabrics', 'Easy 30-Day Returns', 'Exclusive Member Offers'].map((t) => (
                <span key={t} className="inline-flex items-center gap-3 text-xs tracking-[0.22em] uppercase text-white/80">
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  {t}
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
     <section className="py-20 bg-cream">
  <div className="max-w-screen-xl mx-auto px-6">
    <div className="flex justify-between items-end mb-10">
      <div>
        <p className="section-label mb-1.5">Explore</p>
        <h2 className="section-title">Shop by Category</h2>
      </div>
      <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-dark transition-colors">
        View All <FiArrowRight size={13} />
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CATEGORIES.map((cat) => (
        <Link key={cat.label} to={`/shop?category=${cat.query}`}
          className="group relative overflow-hidden rounded-sm cursor-pointer block h-[420px] md:h-[480px]">
          
          {/* Background Image */}
          <img 
            src={cat.image} 
            alt={cat.label} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Dark Overlay (Taaki text read-able ho) */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-7 z-10">
            <h3 className="font-display text-4xl font-light text-white mb-1 transition-transform duration-300 group-hover:-translate-y-2">
              {cat.label}
            </h3>
            <p className="text-xs tracking-widest uppercase text-white/70">
              {cat.sub}
            </p>
          </div>

          {/* Arrow on hover */}
          <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm
                          flex items-center justify-center opacity-0 group-hover:opacity-100
                          transition-all duration-300 text-white z-20">
            <FiArrowRight size={16} />
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 bg-soft ">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="section-label mb-1.5">Trending Now</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-dark transition-colors">
              See All <FiArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          <div className="text-center mt-10">
              <motion.div
    whileHover="hover"
    whileTap="tap"
    variants={{
      hover: { scale: 1.04 },
      tap: { scale: 0.96 }
    }}
  >
    <Link 
      to="/shop" 
      className="relative overflow-hidden inline-flex items-center justify-center btn-primary bg-warm hover:bg-accent py-3.5 px-8 rounded-sm transition-all duration-300 group"
    >
      {/* ✨ Animated Hover Shine Effect ✨ */}
      <motion.span 
        variants={{ hover: { x: ['-100%', '200%'] } }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
      />
      
      {/* Button Text & Icon */}
      <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-widest uppercase font-bold">
        Shop Collection
        {/* Flying Arrow Icon */}
        <motion.svg 
          variants={{ hover: { x: 4, y: -4 } }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"
        >
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </span>
    </Link>
  </motion.div>
          </div>
        </div>
      </section>


      <TestimonialsMarquee />

      {/* ── VALUE PROPS ── */}
      <section className="py-16 bg-cream border-t border-soft">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-soft flex items-center justify-center">
                  <Icon size={20} className="text-warm" />
                </div>
                <div>
                  <p className="font-medium text-sm text-dark mb-0.5">{title}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
            {/* ── SALE BANNER ── */}
      <section className="py-5 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-dark rounded-sm px-8 md:px-14 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute right-0 top-0 w-64 h-64 bg-warm/8 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3">Limited Time Offer</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-cream leading-tight mb-4">
                Up to <em className="italic text-accent">50% Off</em><br />Summer Sale
              </h2>
              <p className="text-sm text-cream/50 mb-6 leading-relaxed max-w-sm">
                Shop premium fashion at unbelievable prices. Limited stock — grab yours before it's gone.
              </p>
  <motion.div
    whileHover="hover"
    whileTap="tap"
    variants={{
      hover: { scale: 1.04 },
      tap: { scale: 0.96 }
    }}
  >
    <Link 
      to="/shop" 
      className="relative overflow-hidden inline-flex items-center justify-center btn-primary bg-warm hover:bg-accent py-3.5 px-8 rounded-sm transition-all duration-300 group"
    >
      {/* ✨ Animated Hover Shine Effect ✨ */}
      <motion.span 
        variants={{ hover: { x: ['-100%', '200%'] } }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
      />
      
      {/* Button Text & Icon */}
      <span className="relative z-10 flex items-center gap-2.5 text-xs tracking-widest uppercase font-bold">
        Shop The Sale
        {/* Flying Arrow Icon */}
        <motion.svg 
          variants={{ hover: { x: 4, y: -4 } }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"
        >
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </span>
    </Link>
  </motion.div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-3 relative z-10">
  {/* Left Image Box */}
  <div className="rounded-sm aspect-[3/4] overflow-hidden shadow-2xl transition-transform duration-500 hover:-rotate-2">
    <img 
      src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80" 
      alt="Summer Sale Men" 
      className="w-full h-full object-cover"
    />
  </div>

  {/* Right Image Box (Thoda niche shifted) */}
  <div className="rounded-sm aspect-[3/4] mt-6 overflow-hidden shadow-2xl transition-transform duration-500 hover:rotate-2">
    <img 
      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" 
      alt="Summer Sale Women" 
      className="w-full h-full object-cover"
    />
  </div>
</div>
          </div>
        </div>
      </section>

    </main>
  );
}
