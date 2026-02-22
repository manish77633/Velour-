import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { FiPackage, FiChevronDown, FiExternalLink, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  'processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned',
];

const STATUS_COLOR = {
  processing: 'bg-amber-50 text-amber-600 border-amber-100',
  confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  out_for_delivery: 'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  returned: 'bg-slate-50 text-slate-600 border-slate-100',
};

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
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
    } catch { 
      toast.error('Failed to load orders'); 
    } finally { 
      setLoading(false); 
    }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId, status, e) => {
    e.stopPropagation(); // Prevent row click navigation
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/deliver`, { deliveryStatus: status });
      toast.success(`Status updated to ${status.replace(/_/g, ' ')}`);
      load();
    } catch { 
      toast.error('Failed to update status'); 
    } finally { 
      setUpdating(''); 
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-1"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl text-dark tracking-tight">Order Management</h1>
          <p className="text-xs text-muted mt-2 uppercase tracking-[0.2em] font-medium flex items-center gap-2">
            <span className="w-8 h-[1px] bg-warm"></span> {total} Total Transactions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14}/>
            <select 
              value={filter} 
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="pl-9 pr-10 py-2.5 text-xs bg-white border border-soft rounded-sm outline-none focus:border-warm appearance-none cursor-pointer uppercase tracking-widest font-semibold text-dark transition-all"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={14}/>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-sm border border-soft shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-soft/30 border-b border-soft">
                {['Order Details', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] tracking-[0.2em] uppercase font-bold text-muted/80">{h}</th>
                ))}
              </tr>
            </thead>
            
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  // Skeleton Loading Effect
                  [...Array(6)].map((_, i) => (
                    <tr key={`skeleton-${i}`} className="border-b border-soft/50">
                      {[...Array(7)].map((__, j) => (
                        <td key={j} className="px-6 py-5">
                          <div className="h-4 bg-soft/40 rounded-full animate-pulse w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <motion.tr variants={itemVariants}>
                    <td colSpan={7} className="text-center py-24">
                      <FiPackage size={40} className="mx-auto mb-4 text-soft/50"/>
                      <p className="text-sm font-medium text-muted">No orders found in this category.</p>
                    </td>
                  </motion.tr>
                ) : (
                  orders.map((order) => (
                    <motion.tr 
                      key={order._id}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: "rgba(250, 247, 242, 0.5)" }}
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="border-b border-soft last:border-0 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold tracking-tighter text-dark uppercase">#{String(order._id).slice(-8)}</span>
                          <FiExternalLink size={10} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </div>
                        <p className="text-[10px] text-muted mt-1 font-medium italic">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-dark">{order.user?.name || 'Guest'}</p>
                        <p className="text-[10px] text-muted truncate max-w-[120px] font-mono">{order.user?.email || 'No Email'}</p>
                      </td>

                      <td className="px-6 py-5 text-xs font-medium text-muted">
                        {order.orderItems?.length || 0} Products
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-display font-bold text-dark">{formatPrice(order.totalPrice)}</p>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                          {order.isPaid ? 'Settled' : 'Pending'}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border ${STATUS_COLOR[order.deliveryStatus] || 'bg-soft text-muted'}`}>
                          {order.deliveryStatus?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                        <div className="relative group/select">
                          <select
                            value={order.deliveryStatus}
                            onChange={(e) => updateStatus(order._id, e.target.value, e)}
                            disabled={updating === order._id || order.deliveryStatus === 'delivered'}
                            className="appearance-none text-[10px] font-bold uppercase tracking-wider border border-soft rounded-sm pl-3 pr-8 py-2 bg-white outline-none focus:border-warm w-40 disabled:opacity-40 cursor-pointer hover:border-dark transition-all"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                          {updating === order._id ? (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-warm border-t-transparent rounded-full animate-spin"/>
                          ) : (
                            <FiChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-hover/select:text-dark transition-colors"/>
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

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-soft bg-soft/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Showing Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-soft bg-white rounded-sm disabled:opacity-30 hover:bg-dark hover:text-white transition-all"
              >
                Previous
              </button>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-soft bg-white rounded-sm disabled:opacity-30 hover:bg-dark hover:text-white transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}