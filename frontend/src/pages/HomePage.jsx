import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/Loader';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiStar } from 'react-icons/fi';

const CATEGORIES = [
  { label: 'Men',   sub: '142 Styles',  query: 'Men',   gradient: 'from-[#3D2E28] to-[#6B4F3F]' },
  { label: 'Women', sub: '218 Styles',  query: 'Women', gradient: 'from-[#4A3728] to-[#C4A882]' },
  { label: 'Kids',  sub: '96 Styles',   query: 'Kids',  gradient: 'from-[#2D2320] to-[#A67B5B]' },
];

const VALUE_PROPS = [
  { icon: FiTruck,     title: 'Free Delivery',    desc: 'On orders above ₹999' },
  { icon: FiRefreshCw, title: 'Easy Returns',     desc: '30-day hassle-free returns' },
  { icon: FiShield,    title: 'Secure Payments',  desc: 'Razorpay 256-bit SSL' },
  { icon: FiStar,      title: 'Premium Quality',  desc: 'Curated sustainable fabrics' },
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-warm/10 rounded-full blur-3xl"/>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/8 rounded-full blur-3xl"/>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20">
          {/* Left */}
          <div className="relative z-10">
            <p className="flex items-center gap-3 text-xs tracking-[0.28em] uppercase text-accent mb-6">
              <span className="w-10 h-px bg-accent"/>
              New Collection 2025
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-cream mb-6">
              Dress with<br/>
              <em className="text-accent italic">Purpose</em><br/>
              & Precision
            </h1>
            <p className="text-sm leading-relaxed text-cream/50 mb-8 max-w-md">
              Curated fashion for Men, Women & Kids. Premium fabrics, timeless silhouettes,
              and designs that speak without words.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/shop" className="btn-primary bg-warm hover:bg-accent py-3.5 px-7">
                Shop Collection
              </Link>
              <Link to="/shop?category=Women"
                className="border border-cream/25 text-cream hover:border-cream hover:bg-cream/5
                           text-xs tracking-widest uppercase px-7 py-3.5 rounded-sm transition-all duration-200 inline-flex items-center gap-2">
                Women's Edit <FiArrowRight size={14}/>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-cream/10">
              {[['500+','Styles'],['50K+','Customers'],['4.9★','Rating']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-semibold text-cream">{num}</p>
                  <p className="text-xs tracking-widest uppercase text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual Cards */}
          <div className="relative h-[520px] hidden lg:block">
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-60 h-[380px] rounded-sm bg-gradient-to-br from-[#3D2E28] to-[#6B4F3F] shadow-2xl flex items-center justify-center font-display text-cream/30 text-lg tracking-widest"/>
            <div className="absolute left-12 bottom-16 w-44 h-56 rounded-sm bg-gradient-to-br from-[#8B6F5C] to-[#C4A882] shadow-xl flex items-center justify-center font-display text-white/30 tracking-widest"/>
            <div className="absolute right-14 top-12 w-28 h-36 rounded-sm bg-gradient-to-br from-[#2D2320] to-[#4A3728] shadow-lg"/>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-warm py-3 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee gap-12">
          {[...Array(2)].map((_, idx) => (
            <React.Fragment key={idx}>
              {['Free Shipping Above ₹999','New Summer Collection','Premium Quality Fabrics','Easy 30-Day Returns','Exclusive Member Offers'].map((t) => (
                <span key={t} className="inline-flex items-center gap-3 text-xs tracking-[0.22em] uppercase text-white/80">
                  <span className="w-1 h-1 rounded-full bg-white/50"/>
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
              View All <FiArrowRight size={13}/>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} to={`/shop?category=${cat.query}`}
                className="group relative overflow-hidden rounded-sm cursor-pointer block">
                <div className={`bg-gradient-to-br ${cat.gradient} h-[420px] md:h-[480px] flex flex-col justify-end p-7 transition-transform duration-500 group-hover:scale-[1.02]`}>
                  <div className="relative z-10">
                    <h3 className="font-display text-4xl font-light text-white mb-1">{cat.label}</h3>
                    <p className="text-xs tracking-widest uppercase text-white/60">{cat.sub}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                </div>
                {/* Arrow on hover */}
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm
                                flex items-center justify-center opacity-0 group-hover:opacity-100
                                transition-opacity duration-300 text-white">
                  <FiArrowRight size={16}/>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 bg-soft">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="section-label mb-1.5">Trending Now</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-dark transition-colors">
              See All <FiArrowRight size={13}/>
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8}/>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p._id} product={p}/>)}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/shop" className="btn-outline inline-flex">View All Products <FiArrowRight size={14}/></Link>
          </div>
        </div>
      </section>

      {/* ── SALE BANNER ── */}
      <section className="py-5 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-dark rounded-sm px-8 md:px-14 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute right-0 top-0 w-64 h-64 bg-warm/8 rounded-full blur-3xl"/>
            </div>
            <div className="relative z-10">
              <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3">Limited Time Offer</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-cream leading-tight mb-4">
                Up to <em className="italic text-accent">50% Off</em><br/>Summer Sale
              </h2>
              <p className="text-sm text-cream/50 mb-6 leading-relaxed max-w-sm">
                Shop premium fashion at unbelievable prices. Limited stock — grab yours before it's gone.
              </p>
              <Link to="/shop?sort=price_low" className="btn-primary bg-warm hover:bg-accent inline-flex">
                Shop the Sale <FiArrowRight size={14}/>
              </Link>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-3 relative z-10">
              <div className="bg-gradient-to-br from-[#3D2E28] to-[#6B4F3F] rounded-sm aspect-[3/4]"/>
              <div className="bg-gradient-to-br from-[#8B6F5C] to-[#C4A882] rounded-sm aspect-[3/4] mt-6"/>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="py-16 bg-cream border-t border-soft">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-soft flex items-center justify-center">
                  <Icon size={20} className="text-warm"/>
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

    </main>
  );
}
