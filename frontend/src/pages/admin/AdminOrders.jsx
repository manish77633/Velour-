// frontend/src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { FiPackage, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // 👈 Ye line honi chahiye
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  'processing','confirmed','shipped','out_for_delivery','delivered','cancelled','returned',
];
const STATUS_COLOR = {
  processing:       'bg-yellow-100 text-yellow-700',
  confirmed:        'bg-blue-100 text-blue-600',
  shipped:          'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-600',
  returned:         'bg-gray-100 text-gray-600',
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Orders</h1>
          <p className="text-sm text-muted mt-0.5">{total} total orders</p>
        </div>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="border border-soft rounded-sm px-3 py-2 text-sm bg-white outline-none focus:border-warm font-sans">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-sm border border-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-soft/60">
            <tr>
              {['Order ID','Customer','Items','Amount','Payment','Delivery','Update Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs tracking-[0.12em] uppercase font-semibold text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-t border-soft animate-pulse">
                  {[...Array(7)].map((__,j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-soft rounded w-full"/></td>)}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-14 text-muted">
                  <FiPackage size={28} className="mx-auto mb-2 opacity-25"/>
                  <p className="text-sm">No orders found</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t border-soft hover:bg-cream/50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/orders/${order._id}`)}>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold tracking-wider">#{String(order._id).slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{order.user?.name || '—'}</p>
                    <p className="text-xs text-muted truncate max-w-[140px]">{order.user?.email || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider
                      ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider
                      ${STATUS_COLOR[order.deliveryStatus] || 'bg-soft text-muted'}`}>
                      {order.deliveryStatus?.replace(/_/g,' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={order.deliveryStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        disabled={updating === order._id || order.deliveryStatus === 'delivered'}
                        className="appearance-none text-xs border border-soft rounded-sm pl-2 pr-7 py-1.5 bg-white
                                   outline-none focus:border-warm font-sans w-36 disabled:opacity-50 cursor-pointer">
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
                        ))}
                      </select>
                      {updating === order._id ? (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 border border-warm border-t-transparent rounded-full animate-spin"/>
                      ) : (
                        <FiChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"/>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-soft bg-cream/30">
            <span className="text-xs text-muted">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)}
                className="px-3 py-1 text-xs border border-soft rounded-sm disabled:opacity-40 hover:border-dark">← Prev</button>
              <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)}
                className="px-3 py-1 text-xs border border-soft rounded-sm disabled:opacity-40 hover:border-dark">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
