import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import { ProductGridSkeleton } from '../components/common/Loader';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'new',        label: 'Newest First' },
  { value: 'price_low',  label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popular',    label: 'Most Popular' },
];

const DEFAULT_FILTERS = { category: '', size: '', color: '', maxPrice: '', sort: 'new', page: 1 };

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
    <main className="pt-16 min-h-screen bg-cream">

      {/* ── PAGE HEADER ── */}
      <div className="bg-soft border-b border-soft/80 py-8 px-6">
        <div className="max-w-screen-xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-muted mb-3">
            <a href="/" className="hover:text-dark transition-colors">Home</a>
            <span>/</span>
            <span className="text-dark">{catLabel}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label mb-1">{filters.category || 'All Categories'}</p>
              <h1 className="section-title">{catLabel}</h1>
            </div>

            {/* Category Quick Tabs */}
            <div className="flex gap-2 flex-wrap">
              {['All','Men','Women','Kids'].map((c) => (
                <button key={c}
                  onClick={() => setFilters((f) => ({ ...f, category: c === 'All' ? '' : c, page: 1 }))}
                  className={`px-4 py-1.5 text-xs tracking-widest uppercase rounded-sm border transition-all
                    ${(c === 'All' && !filters.category) || filters.category === c
                      ? 'bg-dark text-white border-dark'
                      : 'border-soft text-muted hover:border-dark hover:text-dark'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="flex gap-8">

          {/* ── SIDEBAR (Desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <ProductFilters filters={filters} onChange={setFilters} onReset={handleReset}/>
          </aside>

          {/* ── PRODUCTS AREA ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button onClick={() => setMobileFilter(true)}
                  className="lg:hidden flex items-center gap-2 border border-soft px-3 py-2 rounded-sm text-xs tracking-wider uppercase hover:border-dark transition-colors">
                  <FiFilter size={14}/> Filters
                </button>
                <span className="text-xs text-muted">
                  {loading ? '...' : `${total} products`}
                </span>
              </div>

              {/* Sort */}
              <div className="relative">
                <select value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
                  className="appearance-none pl-3 pr-8 py-2 border border-soft rounded-sm text-xs bg-white cursor-pointer outline-none focus:border-warm font-sans">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted"/>
              </div>
            </div>

            {/* Active filter tags */}
            {(filters.category || filters.size || filters.color || filters.search) && (
              <div className="flex gap-2 flex-wrap mb-5">
                {filters.category && (
                  <span className="flex items-center gap-1.5 bg-dark text-white text-xs px-3 py-1 rounded-full">
                    {filters.category}
                    <button onClick={() => setFilters((f) => ({ ...f, category: '', page: 1 }))}><FiX size={11}/></button>
                  </span>
                )}
                {filters.size && (
                  <span className="flex items-center gap-1.5 bg-dark text-white text-xs px-3 py-1 rounded-full">
                    Size: {filters.size}
                    <button onClick={() => setFilters((f) => ({ ...f, size: '', page: 1 }))}><FiX size={11}/></button>
                  </span>
                )}
                {filters.search && (
                  <span className="flex items-center gap-1.5 bg-dark text-white text-xs px-3 py-1 rounded-full">
                    "{filters.search}"
                    <button onClick={() => setFilters((f) => ({ ...f, search: '', page: 1 }))}><FiX size={11}/></button>
                  </span>
                )}
                <button onClick={handleReset} className="text-xs text-muted underline hover:text-dark ml-1">Clear all</button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <ProductGridSkeleton count={8}/>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-dark mb-2">No products found</p>
                <p className="text-sm text-muted mb-5">Try adjusting your filters</p>
                <button onClick={handleReset} className="btn-outline text-xs py-2.5 px-6">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {products.map((p) => <ProductCard key={p._id} product={p}/>)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p}
                    onClick={() => setFilters((f) => ({ ...f, page: p }))}
                    className={`w-9 h-9 rounded-sm text-sm transition-all
                      ${filters.page === p ? 'bg-dark text-white' : 'border border-soft text-muted hover:border-dark'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      {mobileFilter && (
        <>
          <div className="fixed inset-0 bg-dark/50 z-40" onClick={() => setMobileFilter(false)}/>
          <div className="fixed inset-y-0 left-0 w-80 bg-cream z-50 overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl">Filters</h3>
              <button onClick={() => setMobileFilter(false)} className="w-9 h-9 rounded-full hover:bg-soft flex items-center justify-center">
                <FiX size={20}/>
              </button>
            </div>
            <ProductFilters filters={filters} onChange={(f) => { setFilters(f); }} onReset={() => { handleReset(); setMobileFilter(false); }}/>
            <button onClick={() => setMobileFilter(false)} className="btn-primary w-full justify-center mt-8">
              Show {total} Products
            </button>
          </div>
        </>
      )}
    </main>
  );
}
