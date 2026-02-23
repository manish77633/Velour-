// frontend/src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { FiPackage, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = [
  'processing','confirmed','shipped','out_for_delivery','delivered','cancelled','returned',
];

// Dashboard से मैच करते हुए कलर्स (Pastel + Border)
const STATUS_COLOR = {
  processing:       'bg-yellow-50 text-yellow-700 border-yellow-100',
  confirmed:        'bg-indigo-50 text-indigo-700 border-indigo-100',
  shipped:          'bg-blue-50 text-blue-700 border-blue-100',
  out_for_delivery: 'bg-purple-50 text-purple-700 border-purple-100',
  delivered:        'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled:        'bg-red-50 text-red-700 border-red-100',
  returned:         'bg-gray-50 text-gray-700 border-gray-200',
};

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const navigate = useNavigate();
  const [updating, setUpdating] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filter) params.status = filter;
      const { data } = await api.get('/orders', { params });
      setOrders(data.orders);
      setTotal(data.total);
    } catch { toast.error('Failed to load orders'); }
    finally  { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/deliver`, { deliveryStatus: status });
      toast.success(`Status updated to "${status.replace(/_/g,' ')}"`);
      load();
    } catch { toast.error('Failed to update status'); }
    finally  { setUpdating(''); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="animate-enter">
      {/* Dashboard Custom Animation Style */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-enter { animation: slideUpFade 0.6s ease-out forwards; }
      `}</style>

      {/* Header - Exactly matched with Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-normal text-dark">Orders</h1>
          <p className="text-sm text-muted mt-1 font-light tracking-wide">{total} total orders</p>
        </div>
        
        <select 
          value={filter} 
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="border border-soft rounded-sm px-4 py-2 text-sm bg-white outline-none focus:border-warm font-sans text-dark shadow-sm transition-all"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
          ))}
        </select>
      </div>

      {/* Table Container - Matched borders and rounded-sm */}
      <div className="bg-white rounded-sm border border-soft shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-soft">
              <tr>
                {['Order ID','Customer','Items','Amount','Payment','Delivery','Update Status'].map((h) => (
                  <th key={h} className="px-5 py-4 text-xs tracking-[0.12em] uppercase font-semibold text-muted whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  // Smooth Skeleton Loader
                  [...Array(6)].map((_, i) => (
                    <motion.tr key={`skel-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-soft last:border-0">
                      {[...Array(7)].map((__,j) => (
                        <td key={`skel-td-${j}`} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded-sm w-full animate-pulse"/>
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : orders.length === 0 ? (
                  // Empty State
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td colSpan={7} className="text-center py-16 text-muted">
                      <div className="bg-gray-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiPackage size={24} className="opacity-40"/>
                      </div>
                      <p className="text-sm font-medium tracking-wide">No orders found</p>
                    </td>
                  </motion.tr>
                ) : (
                  // Animated Rows matching Dashboard typography
                  orders.map((order) => (
                    <motion.tr 
                      key={order._id} 
                      variants={rowVariants}
                      className="group border-b border-soft last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-xs font-bold text-dark group-hover:text-warm transition-colors">
                          #{String(order._id).slice(-8).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-muted mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                        </p>
                      </td>
                      
                      <td className="px-5 py-4">
                        <p className="font-medium text-sm text-dark">{order.user?.name || 'Guest'}</p>
                        <p className="text-[11px] text-muted truncate max-w-[140px] mt-0.5">{order.user?.email || '—'}</p>
                      </td>
                      
                      <td className="px-5 py-4 text-xs font-medium text-muted">
                        {order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''}
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-dark">{formatPrice(order.totalPrice)}</span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-medium border
                          ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-medium border
                          ${STATUS_COLOR[order.deliveryStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {order.deliveryStatus?.replace(/_/g,' ')}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <select
                            value={order.deliveryStatus}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            disabled={updating === order._id || order.deliveryStatus === 'delivered'}
                            className="appearance-none text-xs font-medium border border-soft rounded-sm pl-3 pr-8 py-1.5 bg-white
                                       outline-none focus:border-warm w-36 disabled:opacity-50 cursor-pointer hover:border-dark transition-colors text-dark"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
                            ))}
                          </select>
                          {updating === order._id ? (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-warm border-t-transparent rounded-full animate-spin"/>
                          ) : (
                            <FiChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"/>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>

        {/* Pagination - Matched with Dashboard's clean style */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-5 py-4 border-t border-soft bg-white">
            <span className="text-xs text-muted font-medium">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)}
                className="px-3 py-1.5 text-xs font-medium border border-soft rounded-sm disabled:opacity-40 hover:border-dark hover:text-dark text-muted transition-all">
                ← Prev
              </button>
              <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)}
                className="px-3 py-1.5 text-xs font-medium border border-soft rounded-sm disabled:opacity-40 hover:border-dark hover:text-dark text-muted transition-all">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}