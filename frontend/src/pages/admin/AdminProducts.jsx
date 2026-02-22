// frontend/src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiStar, FiAlertTriangle, FiFilter, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [catFilter,setCatFilter]= useState('');
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [delId,    setDelId]    = useState(null); // confirm delete

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search)    params.search   = search;
      if (catFilter) params.category = catFilter;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
    } catch { toast.error('Failed to load products'); }
    finally  { setLoading(false); }
  }, [page, search, catFilter]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setDelId(null);
      loadProducts();
    } catch { toast.error('Delete failed'); }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="animate-fade-in">
      {/* Internal CSS for smooth custom animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slide-up { animation: slideUpFade 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-normal text-dark">Products</h1>
          <p className="text-sm text-muted mt-1 font-light tracking-wide">{total} products found</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="btn-primary inline-flex items-center gap-2 group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
        >
          <FiPlus size={18} className="transition-transform group-hover:rotate-90"/> 
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-sm border border-soft p-1.5 mb-6 flex flex-col md:flex-row gap-2 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 group">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-warm transition-colors"/>
          <input 
            type="text" 
            placeholder="Search products by name..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent outline-none text-dark placeholder:text-muted/70 transition-all"
          />
        </div>

        <div className="h-px md:h-8 w-full md:w-px bg-soft my-auto mx-1 hidden md:block"></div>

        {/* Category Select */}
        <div className="relative min-w-[180px]">
          <FiFilter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"/>
          <select 
            value={catFilter} 
            onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-transparent outline-none cursor-pointer text-dark hover:bg-gray-50 transition-colors appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Accessories">Accessories</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-muted"></div>
        </div>

        {/* Clear Button */}
        {(search || catFilter) && (
          <button 
            onClick={() => { setSearch(''); setCatFilter(''); setPage(1); }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-sm transition-all animate-fade-in"
          >
            <FiX size={12}/> Clear
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-sm border border-soft overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b border-soft">
              <tr>
                {['Product','Category','Price','Stock','Rating','Actions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-xs tracking-[0.15em] uppercase font-medium text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-soft">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="flex gap-3"><div className="w-10 h-12 bg-gray-200 rounded-sm"/><div className="space-y-2 w-32"><div className="h-3 bg-gray-200 rounded"/><div className="h-2 bg-gray-100 rounded w-20"/></div></div></td>
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-16"/></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center animate-slide-up">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <FiAlertTriangle size={24} className="text-muted/50"/>
                      </div>
                      <p className="font-medium text-dark">No products found</p>
                      <p className="text-xs text-muted mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p, index) => (
                  <tr 
                    key={p._id} 
                    className="hover:bg-warm/5 transition-colors group animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }} // Staggered Animation
                  >
                    {/* Product Info */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-12 rounded-sm overflow-hidden bg-gray-100 border border-soft flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/>
                            : <div className="w-full h-full flex items-center justify-center text-muted/30 text-[10px]">IMG</div>}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-dark leading-tight truncate max-w-[180px]">{p.name}</p>
                          {p.isFeatured && (
                            <span className="inline-block mt-1 text-[9px] font-bold tracking-wider text-warm bg-warm/10 px-1.5 py-0.5 rounded-sm">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3">
                      <span className="text-xs text-muted font-medium bg-gray-50 border border-soft px-2.5 py-1 rounded-full">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-dark">{formatPrice(p.price)}</span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-muted line-through">{formatPrice(p.originalPrice)}</span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.stockQuantity > 10 ? 'bg-green-500' : p.stockQuantity > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                        <span className={`text-xs font-medium 
                          ${p.stockQuantity === 0 ? 'text-red-600'
                            : p.stockQuantity < 10 ? 'text-yellow-700'
                            : 'text-green-700'}`}>
                          {p.stockQuantity === 0 ? 'Out of Stock' : `${p.stockQuantity} Units`}
                        </span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <FiStar size={13} className="fill-amber-400 text-amber-400"/>
                        <span className="text-sm font-medium text-dark">{p.averageRating || 0}</span>
                        <span className="text-xs text-muted">({p.numReviews})</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/products/${p._id}/edit`}
                          className="p-2 text-muted hover:text-dark hover:bg-white border border-transparent hover:border-soft rounded-sm transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={14}/>
                        </Link>
                        <button 
                          onClick={() => setDelId(p._id)}
                          className="p-2 text-muted hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-sm transition-all"
                          title="Delete"
                        >
                          <FiTrash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-4 border-t border-soft bg-gray-50/50">
            <span className="text-xs text-muted mb-2 sm:mb-0">Showing page {page} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button 
                disabled={page === 1} 
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs font-medium border border-soft rounded-sm disabled:opacity-40 hover:bg-white hover:text-dark transition-colors"
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)) // Smart slicing for many pages
                .map((p) => (
                <button 
                  key={p} 
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center text-xs rounded-sm border transition-all duration-200
                    ${page === p ? 'bg-dark text-white border-dark shadow-sm' : 'bg-white border-soft text-muted hover:border-dark hover:text-dark'}`}
                >
                  {p}
                </button>
              ))}
              
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs font-medium border border-soft rounded-sm disabled:opacity-40 hover:bg-white hover:text-dark transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal - Animated */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setDelId(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-2xl relative z-10 animate-scale-in border border-soft">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <FiTrash2 size={24} className="text-red-500"/>
            </div>
            
            <h3 className="font-display text-xl text-center text-dark mb-2">Delete Product?</h3>
            <p className="text-sm text-muted text-center mb-8 leading-relaxed">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDelId(null)}
                className="flex-1 py-3 text-sm font-medium text-dark border border-soft rounded-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(delId)}
                className="flex-1 py-3 text-sm font-medium text-white bg-red-600 rounded-sm hover:bg-red-700 hover:shadow-lg transition-all"
              >
                Delete It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}