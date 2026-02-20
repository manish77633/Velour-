import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiCreditCard, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['processing','confirmed','shipped','out_for_delivery','delivered','cancelled','returned'];
const STATUS_COLOR = {
  processing:'bg-yellow-100 text-yellow-700', confirmed:'bg-blue-100 text-blue-600',
  shipped:'bg-indigo-100 text-indigo-700', out_for_delivery:'bg-purple-100 text-purple-700',
  delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-600', returned:'bg-gray-100 text-gray-600',
};

export default function AdminOrderDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${id}/deliver`, { deliveryStatus: status });
      setOrder(data.order);
      toast.success(`Status updated to "${status.replace(/_/g,' ')}"`);
    } catch { toast.error('Failed to update'); }
    finally  { setUpdating(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-soft border-t-warm rounded-full animate-spin"/>
    </div>
  );

  if (!order) return (
    <div className="text-center py-16">
      <p className="font-display text-2xl mb-2">Order not found</p>
      <Link to="/admin/orders" className="btn-outline py-2 px-5 text-xs mt-4 inline-flex">← Back to Orders</Link>
    </div>
  );

  const addr = order.shippingAddress;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/orders')}
          className="w-9 h-9 flex items-center justify-center border border-soft rounded-sm hover:border-dark transition-colors">
          <FiArrowLeft size={16}/>
        </button>
        <div>
          <h1 className="font-display text-3xl">Order Detail</h1>
          <p className="text-sm text-muted">#{String(order._id).slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium uppercase tracking-wider ${STATUS_COLOR[order.deliveryStatus]||'bg-soft text-muted'}`}>
            {order.deliveryStatus?.replace(/_/g,' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── LEFT: Products ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Products */}
          <div className="bg-white rounded-sm border border-soft p-6">
            <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft flex items-center gap-2">
              <FiPackage size={17}/> Ordered Items ({order.orderItems?.length})
            </h2>
            <div className="space-y-4">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-soft last:border-0 last:pb-0">
                  {/* Image */}
                  <div className="w-20 h-24 bg-soft rounded-sm overflow-hidden flex-shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-muted/30"><FiPackage size={20}/></div>}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight">{item.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      <p className="text-xs text-muted">Size: <span className="text-dark font-medium">{item.size}</span></p>
                      {item.color && <p className="text-xs text-muted">Color: <span className="text-dark font-medium">{item.color}</span></p>}
                      <p className="text-xs text-muted">Qty: <span className="text-dark font-medium">{item.quantity}</span></p>
                    </div>
                    <p className="text-xs text-muted mt-1">Unit Price: <span className="text-dark">{formatPrice(item.price)}</span></p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="mt-5 pt-4 border-t border-soft space-y-2 text-sm">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
              <div className="flex justify-between text-muted"><span>Shipping</span><span>{order.shippingPrice===0?'Free':formatPrice(order.shippingPrice)}</span></div>
              <div className="flex justify-between text-muted"><span>Tax (GST)</span><span>{formatPrice(order.taxPrice)}</span></div>
              {order.discount>0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-soft">
                <span>Total</span><span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-sm border border-soft p-6">
            <h2 className="font-display text-lg mb-4">Update Delivery Status</h2>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button key={s} onClick={() => updateStatus(s)} disabled={updating || order.deliveryStatus===s}
                  className={`px-4 py-2 text-xs border rounded-sm transition-all font-medium capitalize disabled:cursor-not-allowed
                    ${order.deliveryStatus===s ? 'bg-dark text-white border-dark' : 'border-soft hover:border-warm hover:text-warm disabled:opacity-40'}`}>
                  {s.replace(/_/g,' ')}
                </button>
              ))}
            </div>
            {updating && <p className="text-xs text-muted mt-3 flex items-center gap-2"><span className="w-3 h-3 border border-warm border-t-transparent rounded-full animate-spin"/> Updating status...</p>}
          </div>
        </div>

        {/* ── RIGHT: Customer & Payment ── */}
        <div className="space-y-5">

          {/* Customer Info */}
          <div className="bg-white rounded-sm border border-soft p-5">
            <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft flex items-center gap-2">
              <FiUser size={15}/> Customer
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {order.user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-sm">{order.user?.name || '—'}</p>
                <p className="text-xs text-muted">{order.user?.email || '—'}</p>
              </div>
            </div>
            <div className="text-xs text-muted space-y-1">
              <p>📞 {addr?.phone || '—'}</p>
              <p>🆔 ID: {String(order.user?._id || '').slice(-8).toUpperCase()}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-sm border border-soft p-5">
            <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft flex items-center gap-2">
              <FiMapPin size={15}/> Shipping Address
            </h2>
            {addr ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-muted leading-relaxed">
                  {addr.street}<br/>
                  {addr.city}, {addr.state}<br/>
                  PIN: {addr.pincode}<br/>
                  {addr.country}
                </p>
                <p className="text-muted pt-1">📞 {addr.phone}</p>
              </div>
            ) : <p className="text-sm text-muted">No address on record</p>}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-sm border border-soft p-5">
            <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft flex items-center gap-2">
              <FiCreditCard size={15}/> Payment
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Method</span>
                <span className="font-medium">{order.paymentMethod==='cod' ? '💵 Cash on Delivery' : '💳 Razorpay'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                  {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                </span>
              </div>
              {order.isPaid && order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted">Paid on</span>
                  <span className="text-xs">{new Date(order.paidAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div className="pt-2 border-t border-soft">
                  <p className="text-xs text-muted mb-1">Payment ID</p>
                  <p className="text-xs font-mono bg-soft px-2 py-1 rounded break-all">{order.razorpayPaymentId}</p>
                </div>
              )}
              {order.paymentMethod==='cod' && !order.isPaid && (
                <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-sm">
                  <p className="text-xs text-amber-700">Payment will be collected on delivery. Mark as paid once collected.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-sm border border-soft p-5">
            <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft">Timeline</h2>
            <div className="space-y-3">
              {[
                { label:'Order Placed',     date: order.createdAt, done: true  },
                { label:'Payment',          date: order.paidAt,    done: order.isPaid, note: order.isPaid?'Paid':'Pending' },
                { label:'Shipped',          date: null,            done: ['shipped','out_for_delivery','delivered'].includes(order.deliveryStatus) },
                { label:'Delivered',        date: order.deliveredAt,done: order.deliveryStatus==='delivered' },
              ].map(({ label, date, done, note }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'bg-green-500' : 'bg-soft border border-soft'}`}>
                    {done && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${done ? 'text-dark' : 'text-muted'}`}>{label}</p>
                    {date && <p className="text-[10px] text-muted">{new Date(date).toLocaleDateString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p>}
                    {note && !date && <p className="text-[10px] text-amber-600">{note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
