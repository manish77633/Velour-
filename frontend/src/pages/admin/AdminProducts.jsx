// frontend/src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiStar, FiAlertTriangle } from 'react-icons/fi';
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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="text-sm text-muted mt-0.5">{total} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
          <FiPlus size={16}/> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm border border-soft p-4 mb-5 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9 py-2 text-sm w-full"/>
        </div>
        <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="border border-soft rounded-sm px-3 py-2 text-sm bg-white outline-none focus:border-warm font-sans">
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
        {(search || catFilter) && (
          <button onClick={() => { setSearch(''); setCatFilter(''); setPage(1); }}
            className="text-xs text-muted hover:text-dark underline px-2">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-soft/60">
            <tr>
              {['Product','Category','Price','Stock','Rating','Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs tracking-[0.12em] uppercase font-semibold text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-soft animate-pulse">
                  {[...Array(6)].map((__, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-soft rounded w-full"/></td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-muted">
                  <FiAlertTriangle size={28} className="mx-auto mb-2 opacity-30"/>
                  <p className="text-sm">No products found.</p>
                  <p className="text-xs mt-1">Run <code className="bg-soft px-1 rounded">node seeder.js</code> or add products manually.</p>
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-t border-soft hover:bg-cream/50 transition-colors">
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-14 rounded-sm overflow-hidden bg-soft flex-shrink-0">
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/>
                          : <div className="w-full h-full flex items-center justify-center text-muted/30 text-xs">IMG</div>}
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-tight">{p.name}</p>
                        {p.isFeatured && (
                          <span className="text-[10px] bg-warm/15 text-warm px-1.5 py-0.5 rounded-sm">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="text-xs border border-soft px-2 py-0.5 rounded-sm">{p.category}</span>
                  </td>
                  {/* Price */}
                  <td className="px-4 py-3">
                    <p className="font-semibold">{formatPrice(p.price)}</p>
                    {p.originalPrice && (
                      <p className="text-xs text-muted line-through">{formatPrice(p.originalPrice)}</p>
                    )}
                  </td>
                  {/* Stock */}
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                      ${p.stockQuantity === 0 ? 'bg-red-100 text-red-600'
                        : p.stockQuantity < 10 ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'}`}>
                      {p.stockQuantity === 0 ? 'Out of Stock' : `${p.stockQuantity} in stock`}
                    </span>
                  </td>
                  {/* Rating */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <FiStar size={12} className="fill-accent text-accent"/>
                      <span className="text-sm">{p.averageRating || 0}</span>
                      <span className="text-xs text-muted">({p.numReviews})</span>
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/${p._id}/edit`}
                        className="w-8 h-8 flex items-center justify-center border border-soft rounded-sm hover:border-warm hover:text-warm transition-all">
                        <FiEdit2 size={13}/>
                      </Link>
                      <button onClick={() => setDelId(p._id)}
                        className="w-8 h-8 flex items-center justify-center border border-soft rounded-sm hover:border-red-400 hover:text-red-400 transition-all">
                        <FiTrash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-soft bg-cream/30">
            <span className="text-xs text-muted">Showing {products.length} of {total}</span>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-xs border border-soft rounded-sm disabled:opacity-40 hover:border-dark transition-colors">
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded-sm border transition-all
                    ${page === p ? 'bg-dark text-white border-dark' : 'border-soft hover:border-dark'}`}>
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-xs border border-soft rounded-sm disabled:opacity-40 hover:border-dark transition-colors">
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {delId && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-sm p-7 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={20} className="text-red-500"/>
            </div>
            <h3 className="font-display text-xl text-center mb-2">Delete Product?</h3>
            <p className="text-sm text-muted text-center mb-6">This action cannot be undone. All associated data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)}
                className="flex-1 btn-outline py-2.5 justify-center">Cancel</button>
              <button onClick={() => handleDelete(delId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs tracking-widest uppercase py-2.5 rounded-sm transition-colors">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
