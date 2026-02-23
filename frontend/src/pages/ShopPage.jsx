// frontend/src/pages/ShopPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; // 👈 Added Animation Library
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import { ProductGridSkeleton } from '../components/common/Loader';
import { FiFilter, FiX, FiChevronDown, FiShoppingBag } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'new',        label: 'Newest First' },
  { value: 'price_low',  label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popular',    label: 'Most Popular' },
];

const DEFAULT_FILTERS = { category: '', size: '', color: '', maxPrice: '', sort: 'new', page: 1 };

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Har product 0.1s ke gap par aayega
      delayChildren: 0.2,
    }
  }
};

const productVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export default function ShopPage() {
  const dispatch     = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading, total, totalPages } = useSelector((s) => s.product);

  const [filters,      setFilters]      = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category') || '',
    sort:     searchParams.get('sort')     || 'new',
    search:   searchParams.get('search')   || '',
  });
  const [mobileFilter, setMobileFilter] = useState(false);

  const load = useCallback(() => {
    const params = { ...filters };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    dispatch(fetchProducts(params));
  }, [dispatch, filters]);

  useEffect(() => { load(); }, [load]);

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  const catLabel = filters.category ? `${filters.category}'s Collection` : 'All Products';

  return (
    <main className="pt-20 min-h-screen bg-[#FAF7F2]"> {/* Updated bg to match Premium theme */}

      {/* ── PAGE HEADER ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-[#E5E5E5] py-10 px-6"
      >
        <div className="max-w-screen-xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-3 tracking-wide uppercase">
            <a href="/" className="hover:text-black transition-colors">Home</a>
            <span>/</span>
            <span className="text-black font-medium">{catLabel}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-[#C4A882] uppercase tracking-[0.2em] mb-2">
                {filters.category || 'Discover'}
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-black">
                {catLabel}
              </h1>
            </div>

            {/* Category Quick Tabs */}
            <div className="flex gap-3 flex-wrap">
              {['All','Men','Women','Kids'].map((c) => (
                <button key={c}
                  onClick={() => setFilters((f) => ({ ...f, category: c === 'All' ? '' : c, page: 1 }))}
                  className={`px-6 py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-300
                    ${(c === 'All' && !filters.category) || filters.category === c
                      ? 'bg-black text-white'
                      : 'bg-transparent text-gray-500 hover:text-black border border-transparent hover:border-gray-200'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="flex gap-10">

          {/* ── SIDEBAR (Desktop) ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-fit">
            <ProductFilters filters={filters} onChange={setFilters} onReset={handleReset}/>
          </aside>

          {/* ── PRODUCTS AREA ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4 border-b border-[#E5E5E5] pb-4">
              <div className="flex items-center gap-4">
                {/* Mobile filter button */}
                <button onClick={() => setMobileFilter(true)}
                  className="lg:hidden flex items-center gap-2 border border-black px-4 py-2 text-[10px] tracking-widest uppercase hover:bg-black hover:text-whi transition-all">
                  <FiFilter size={14}/> Filters
                </button>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  {loading ? 'Loading...' : `${total} RESULTS`}
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <select value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
                  className="appearance-none pl-4 pr-10 py-2 border-none text-xs bg-transparent cursor-pointer outline-none font-medium tracking-wider text-black  transition-colors"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <FiChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black group-hover:text-[#C4A882] transition-colors"/>
              </div>
            </div>

            {/* Active filter tags */}
            {(filters.category || filters.size || filters.color || filters.search) && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex gap-3 flex-wrap mb-8"
              >
                {filters.category && (
                  <span className="flex items-center gap-2 bg-[#F5F5F5] text-black text-[10px] uppercase tracking-wider px-3 py-1.5">
                    {filters.category}
                    <button onClick={() => setFilters((f) => ({ ...f, category: '', page: 1 }))}><FiX size={12}/></button>
                  </span>
                )}
                {filters.size && (
                  <span className="flex items-center gap-2 bg-[#F5F5F5] text-black text-[10px] uppercase tracking-wider px-3 py-1.5">
                    Size: {filters.size}
                    <button onClick={() => setFilters((f) => ({ ...f, size: '', page: 1 }))}><FiX size={12}/></button>
                  </span>
                )}
                {filters.search && (
                  <span className="flex items-center gap-2 bg-[#F5F5F5] text-black text-[10px] uppercase tracking-wider px-3 py-1.5">
                    Search: "{filters.search}"
                    <button onClick={() => setFilters((f) => ({ ...f, search: '', page: 1 }))}><FiX size={12}/></button>
                  </span>
                )}
                <button onClick={handleReset} className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-red-500 underline ml-2 transition-colors">Clear All</button>
              </motion.div>
            )}

            {/* Products Grid with Framer Motion */}
            {loading ? (
              <ProductGridSkeleton count={8}/>
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-24 bg-white border border-[#E5E5E5]"
              >
                <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="font-display text-2xl text-black mb-2">No items found</p>
                <p className="text-sm text-gray-500 mb-6 font-light">Try adjusting your filters or search criteria</p>
                <button onClick={handleReset} className="border border-black px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Clear Filters</button>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={filters.page + filters.sort + filters.category} // Re-trigger animation on change
              >
                {products.map((p) => (
                  <motion.div key={p._id} variants={productVariants}>
                    <ProductCard product={p}/>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-16 border-t border-[#E5E5E5] pt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p}
                    onClick={() => {
                      setFilters((f) => ({ ...f, page: p }));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 flex items-center justify-center text-xs font-medium transition-all duration-300
                      ${filters.page === p 
                        ? 'bg-black text-white' 
                        : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      <AnimatePresence>
        {mobileFilter && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" 
              onClick={() => setMobileFilter(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#FAF7F2] z-50 overflow-y-auto p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display text-2xl">Filters</h3>
                <button onClick={() => setMobileFilter(false)} className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors">
                  <FiX size={20}/>
                </button>
              </div>
              <ProductFilters filters={filters} onChange={(f) => { setFilters(f); }} onReset={() => { handleReset(); setMobileFilter(false); }}/>
              <button onClick={() => setMobileFilter(false)} className="bg-black text-white w-full py-4 text-xs uppercase tracking-widest font-bold mt-8 hover:bg-gray-900 transition-colors">
                View {total} Products
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}