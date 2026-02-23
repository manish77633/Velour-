// frontend/src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiStar, FiAlertTriangle, FiFilter, FiX, FiMoreVertical } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [catFilter,setCatFilter]= useState('');
  const [total,    setTotal]    = useState(0);
  const [page,      setPage]     = useState(1);
  const [delId,    setDelId]    = useState(null); 
  const [activeMenu, setActiveMenu] = useState(null);

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

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
    <div className="animate-fade-in p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUpFade 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-normal text-[#1C1917] tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-1 font-light tracking-wide">{total} products in inventory</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="bg-[#1C1917] text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all active:scale-95"
        >
          <FiPlus size={16} /> <span>Add Product</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-md border border-[#E5E5E5] p-3 mb-6 flex flex-col md:flex-row gap-3 shadow-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative flex-1">
          <FiSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50/50 rounded-sm border border-transparent focus:bg-white focus:border-[#C4A882] outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
          <select 
            value={catFilter} 
            onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
            className="pl-4 pr-10 py-2.5 text-sm bg-gray-50/50 border border-transparent focus:bg-white focus:border-[#C4A882] rounded-sm outline-none cursor-pointer appearance-none"
          >
            <option value="">All Categories</option>
            {['Men', 'Women', 'Kids', 'Accessories'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {(search || catFilter) && (
            <button onClick={() => { setSearch(''); setCatFilter(''); setPage(1); }} className="px-4 text-red-500 bg-red-50 hover:bg-red-100 rounded-sm"><FiX size={18}/></button>
          )}
        </div>
      </div>

      {/* Products Table Container */}
      <div className="bg-white rounded-md border border-[#E5E5E5] overflow-visible shadow-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full text-sm text-left border-separate border-spacing-0">
            <thead className="bg-gray-50 border-b border-[#E5E5E5]">
              <tr>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase font-bold text-gray-500">Product</th>
                <th className="hidden md:table-cell px-6 py-4 text-[10px] tracking-[0.15em] uppercase font-bold text-gray-500">Category</th>
                <th className="hidden md:table-cell px-6 py-4 text-[10px] tracking-[0.15em] uppercase font-bold text-gray-500">Price</th>
                <th className="hidden md:table-cell px-6 py-4 text-[10px] tracking-[0.15em] uppercase font-bold text-gray-500">Stock</th>
                <th className="hidden md:table-cell px-6 py-4 text-[10px] tracking-[0.15em] uppercase font-bold text-gray-500">Rating</th>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase font-bold text-gray-500 text-right md:text-left">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#E5E5E5]">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={6} className="px-6 py-10 bg-gray-50/50"></td></tr>)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-24"><p className="text-gray-500">No products found</p></td>
                </tr>
              ) : (
                products.map((p) => (
                  <motion.tr 
                    key={p._id} 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.01, backgroundColor: "#FAF7F2", zIndex: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white relative"
                  >
                    
                    {/* Product Info */}
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-16 rounded-sm overflow-hidden bg-gray-100 border border-[#E5E5E5] flex-shrink-0 shadow-sm">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/>
                            : <div className="w-full h-full flex items-center justify-center text-gray-400 text-[9px]">IMG</div>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#1C1917] leading-snug truncate max-w-[150px] md:max-w-xs">{p.name}</p>
                          
                          {/* 💡 FIX: Featured Badge is now visible on BOTH Mobile and Desktop */}
                          {p.isFeatured && (
                            <span className="inline-block mt-1 text-[8px] font-bold text-white bg-[#C4A882] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                              Featured
                            </span>
                          )}

                          {/* Mobile-only Price */}
                          <div className="mt-1 md:hidden">
                            <span className="font-bold text-[#1C1917] text-xs">{formatPrice(p.price)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="hidden md:table-cell px-6 py-4 text-gray-600">{p.category}</td>
                    <td className="hidden md:table-cell px-6 py-4 font-bold text-[#1C1917]">{formatPrice(p.price)}</td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <span className={`text-xs font-semibold ${p.stockQuantity === 0 ? 'text-red-600' : 'text-emerald-700'}`}>{p.stockQuantity}</span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center gap-1"><FiStar size={12} className="text-amber-400 fill-amber-400"/><span className="text-xs font-bold">{p.averageRating || 0}</span></div>
                    </td>

                    {/* Actions - ALWAYS Visible on Desktop */}
                    <td className="px-4 md:px-6 py-4 text-right md:text-left">
                      {/* Desktop View Icons */}
                      <div className="hidden md:flex items-center gap-2">
                        <Link 
                          to={`/admin/products/${p._id}/edit`} 
                          className="p-2 text-gray-600 hover:text-[#C4A882] hover:bg-orange-50 rounded-sm transition-all shadow-sm border border-[#E5E5E5]"
                          title="Edit Product"
                        >
                          <FiEdit2 size={15}/>
                        </Link>
                        <button 
                          onClick={() => setDelId(p._id)} 
                          className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-sm transition-all shadow-sm border border-red-200"
                          title="Delete Product"
                        >
                          <FiTrash2 size={15}/>
                        </button>
                      </div>

                      {/* Mobile 3 Dots Menu */}
                      <div className="md:hidden relative inline-block">
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === p._id ? null : p._id); }} className="p-2 text-gray-500">
                          <FiMoreVertical size={20}/>
                        </button>
                        {activeMenu === p._id && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#E5E5E5] shadow-xl rounded-sm z-50 animate-scale-in">
                            <Link to={`/admin/products/${p._id}/edit`} className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-[#1C1917] hover:bg-gray-50 w-full text-left"><FiEdit2 size={14}/> Edit</Link>
                            <button onClick={() => { setDelId(p._id); setActiveMenu(null); }} className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-red-600 hover:bg-red-50 w-full text-left border-t border-[#E5E5E5]"><FiTrash2 size={14}/> Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 mt-4 bg-white border border-[#E5E5E5] rounded-sm shadow-sm animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-xs font-bold uppercase border border-[#E5E5E5] rounded-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">Previous</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-xs font-bold uppercase border border-[#E5E5E5] rounded-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {delId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-sm" onClick={() => setDelId(null)}></div>
          <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-2xl relative z-10 animate-scale-in border border-[#E5E5E5]">
            <FiTrash2 size={32} className="text-red-500 mx-auto mb-4"/>
            <h3 className="font-display text-2xl text-center mb-2 text-[#1C1917]">Are you sure?</h3>
            <p className="text-gray-500 text-center text-sm mb-8">This product will be permanently removed from your store inventory.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 py-3 text-xs font-bold uppercase border border-[#E5E5E5] rounded-sm hover:bg-gray-50 transition-colors text-[#1C1917]">Cancel</button>
              <button onClick={() => handleDelete(delId)} className="flex-1 py-3 text-xs font-bold uppercase text-white bg-red-600 rounded-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}