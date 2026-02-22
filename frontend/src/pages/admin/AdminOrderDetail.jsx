// frontend/src/pages/admin/AdminOrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiCreditCard, FiCheckCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const STATUS_OPTIONS = ['processing','confirmed','shipped','out_for_delivery','delivered','cancelled','returned'];

// Premium Pastel Status Colors (Matched with Dashboard)
const STATUS_COLOR = {
  processing:       'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmed:        'bg-indigo-50 text-indigo-700 border border-indigo-200',
  shipped:          'bg-blue-50 text-blue-700 border border-blue-200',
  out_for_delivery: 'bg-purple-50 text-purple-700 border border-purple-200',
  delivered:        'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled:        'bg-rose-50 text-rose-700 border border-rose-200',
  returned:         'bg-gray-50 text-gray-700 border border-gray-200',
};

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
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
      .catch(() => toast.error('Failed to load order details'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${id}/deliver`, { deliveryStatus: status });
      setOrder(data.order);
      toast.success(`Status updated to "${status.replace(/_/g,' ')}"`);
    } catch { toast.error('Failed to update status'); }
    finally  { setUpdating(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-soft border-t-warm rounded-full animate-spin"/>
        <p className="text-xs tracking-widest uppercase text-muted font-medium">Fetching Details...</p>
      </div>
    </div>
  );

  if (!order) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <FiPackage size={30} className="text-muted opacity-40"/>
      </div>
      <p className="font-display text-3xl mb-2 text-dark">Order Not Found</p>
      <p className="text-sm text-muted mb-8">The order you are looking for does not exist or has been removed.</p>
      <button onClick={() => navigate('/admin/orders')} className="bg-dark text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-black transition-colors">
        ← Back to Orders
      </button>
    </motion.div>
  );

  const addr = order.shippingAddress;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto"
    >
      {/* Premium Header */}
      <motion.div variants={cardVariants} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 bg-white p-5 md:p-6 rounded-sm border border-soft shadow-sm">
        <button onClick={() => navigate('/admin/orders')}
          className="w-10 h-10 flex items-center justify-center border border-soft rounded-sm hover:border-dark hover:bg-gray-50 transition-all group flex-shrink-0">
          <FiArrowLeft size={18} className="text-muted group-hover:text-dark group-hover:-translate-x-1 transition-transform"/>
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl md:text-3xl font-normal text-dark tracking-tight">Order Detail</h1>
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${STATUS_COLOR[order.deliveryStatus] || 'bg-soft text-muted'}`}>
              {order.deliveryStatus?.replace(/_/g,' ')}
            </span>
          </div>
          <p className="text-xs tracking-wide text-muted font-medium uppercase">
            ID: <span className="text-dark font-bold">#{String(order._id).slice(-8).toUpperCase()}</span> 
            <span className="mx-2 opacity-50">|</span> 
            {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric', hour:'2-digit', minute:'2-digit'})}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* ── LEFT COLUMN: Products & Status ── */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">

          {/* Ordered Products Card */}
          <motion.div variants={cardVariants} className="bg-white rounded-sm border border-soft overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 md:p-6 border-b border-soft bg-gray-50/50">
              <h2 className="font-display text-xl text-dark flex items-center gap-3">
                <FiPackage className="text-warm"/> 
                Products Summary ({order.orderItems?.length})
              </h2>
            </div>
            
            <div className="p-5 md:p-6 space-y-6">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-5 pb-6 border-b border-soft last:border-0 last:pb-0 group">
                  {/* Image */}
                  <div className="w-full sm:w-24 h-32 sm:h-28 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-soft group-hover:border-warm/30 transition-colors">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"/>
                      : <div className="w-full h-full flex items-center justify-center text-muted/20"><FiPackage size={24}/></div>}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="font-medium text-base text-dark leading-tight mb-2 group-hover:text-warm transition-colors">{item.name}</p>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="bg-gray-50 px-3 py-1.5 rounded-sm border border-soft text-[11px] text-muted tracking-wider uppercase">Size: <span className="text-dark font-bold">{item.size}</span></div>
                      {item.color && <div className="bg-gray-50 px-3 py-1.5 rounded-sm border border-soft text-[11px] text-muted tracking-wider uppercase">Color: <span className="text-dark font-bold">{item.color}</span></div>}
                      <div className="bg-gray-50 px-3 py-1.5 rounded-sm border border-soft text-[11px] text-muted tracking-wider uppercase">Qty: <span className="text-dark font-bold">{item.quantity}</span></div>
                    </div>
                    <p className="text-[11px] text-muted uppercase tracking-widest">Unit Price: <span className="text-dark font-semibold">{formatPrice(item.price)}</span></p>
                  </div>
                  
                  {/* Total */}
                  <div className="sm:text-right flex-shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-soft">
                    <span className="sm:hidden text-xs text-muted uppercase tracking-widest">Item Total</span>
                    <p className="font-display font-bold text-lg text-dark">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50/50 p-5 md:p-6 border-t border-soft space-y-3">
              <div className="flex justify-between text-sm text-muted"><span>Subtotal</span><span className="text-dark font-medium">{formatPrice(order.itemsPrice)}</span></div>
              <div className="flex justify-between text-sm text-muted"><span>Shipping</span><span className="text-dark font-medium">{order.shippingPrice===0?'Free':formatPrice(order.shippingPrice)}</span></div>
              <div className="flex justify-between text-sm text-muted"><span>Tax (GST)</span><span className="text-dark font-medium">{formatPrice(order.taxPrice)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Discount</span><span className="font-medium">-{formatPrice(order.discount)}</span></div>}
              
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-soft">
                <span className="font-display text-lg text-dark">Total Amount</span>
                <span className="font-display text-2xl font-bold text-dark">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </motion.div>

          {/* Update Status Card */}
          <motion.div variants={cardVariants} className="bg-white rounded-sm border border-soft p-5 md:p-6 shadow-sm">
            <h2 className="font-display text-xl text-dark mb-5 flex items-center gap-2">
              <FiClock className="text-warm"/> Update Delivery Status
            </h2>
            <div className="flex flex-wrap gap-3">
              {STATUS_OPTIONS.map((s) => (
                <button 
                  key={s} 
                  onClick={() => updateStatus(s)} 
                  disabled={updating || order.deliveryStatus===s}
                  className={`relative overflow-hidden px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold border rounded-sm transition-all duration-300 disabled:cursor-not-allowed
                    ${order.deliveryStatus===s 
                      ? 'bg-dark text-white border-dark shadow-md scale-105' 
                      : 'bg-white text-muted border-soft hover:border-warm hover:text-warm disabled:opacity-40 disabled:hover:border-soft disabled:hover:text-muted disabled:scale-100'}`}
                >
                  {s.replace(/_/g,' ')}
                </button>
              ))}
            </div>
            {updating && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-warm mt-4 font-medium flex items-center gap-2 tracking-widest uppercase">
                <span className="w-3.5 h-3.5 border-2 border-warm border-t-transparent rounded-full animate-spin"/> 
                Updating Order System...
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Info Cards ── */}
        <div className="space-y-6 md:space-y-8">

          {/* Customer Info */}
          <motion.div variants={cardVariants} className="bg-white rounded-sm border border-soft p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-display text-lg mb-5 flex items-center gap-3 text-dark">
              <div className="w-8 h-8 rounded-full bg-warm/10 flex items-center justify-center text-warm"><FiUser size={15}/></div>
              Customer Info
            </h2>
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-soft">
              <div className="w-12 h-12 rounded-full bg-gray-100 border border-soft flex items-center justify-center text-dark font-display text-xl flex-shrink-0">
                {order.user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-base text-dark truncate">{order.user?.name || 'Guest User'}</p>
                <p className="text-[11px] text-muted truncate mt-0.5 font-mono">{order.user?.email || 'No email provided'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-muted mb-1">Contact Phone</span>
                <span className="text-sm font-medium text-dark">{addr?.phone || '—'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-muted mb-1">Account ID</span>
                <span className="text-xs font-mono bg-gray-50 px-2 py-1 rounded-sm border border-soft inline-block w-fit text-dark">{String(order.user?._id || 'N/A').slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div variants={cardVariants} className="bg-white rounded-sm border border-soft p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-display text-lg mb-5 flex items-center gap-3 text-dark">
              <div className="w-8 h-8 rounded-full bg-warm/10 flex items-center justify-center text-warm"><FiMapPin size={15}/></div>
              Shipping Destination
            </h2>
            {addr ? (
              <div className="bg-gray-50/50 p-4 rounded-sm border border-soft">
                <p className="font-bold text-sm text-dark mb-2 uppercase tracking-wide">{addr.fullName}</p>
                <p className="text-xs text-muted leading-relaxed">
                  {addr.street}<br/>
                  {addr.city}, {addr.state}<br/>
                  PIN: <span className="font-medium text-dark">{addr.pincode}</span><br/>
                  {addr.country}
                </p>
              </div>
            ) : <p className="text-sm text-muted italic">No address on record</p>}
          </motion.div>

          {/* Payment Info */}
          <motion.div variants={cardVariants} className="bg-white rounded-sm border border-soft p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-display text-lg mb-5 flex items-center gap-3 text-dark">
              <div className="w-8 h-8 rounded-full bg-warm/10 flex items-center justify-center text-warm"><FiCreditCard size={15}/></div>
              Payment Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-soft">
                <span className="text-[10px] uppercase tracking-widest text-muted">Method</span>
                <span className="text-sm font-bold text-dark bg-gray-50 px-3 py-1 rounded-sm border border-soft">
                  {order.paymentMethod==='cod' ? 'Cash on Delivery' : 'Razorpay'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-soft">
                <span className="text-[10px] uppercase tracking-widest text-muted">Status</span>
                <span className={`text-[10px] px-2.5 py-1 rounded-sm font-bold uppercase tracking-widest border ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                  {order.isPaid ? 'Settled' : 'Pending'}
                </span>
              </div>
              
              {order.isPaid && order.paidAt && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-muted">Date Paid</span>
                  <span className="text-xs font-medium text-dark">{new Date(order.paidAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
                </div>
              )}
              
              {order.razorpayPaymentId && (
                <div className="pt-2">
                  <span className="text-[9px] uppercase tracking-widest text-muted block mb-1">Transaction ID</span>
                  <span className="text-xs font-mono bg-gray-50 px-2 py-1.5 rounded-sm border border-soft block break-all text-dark">{order.razorpayPaymentId}</span>
                </div>
              )}
              
              {order.paymentMethod==='cod' && !order.isPaid && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-sm flex items-start gap-2">
                  <FiClock className="text-amber-600 mt-0.5 flex-shrink-0"/>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-amber-800 leading-relaxed">
                    Payment pending. Collect cash from customer upon delivery.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Timeline Tracking */}
          <motion.div variants={cardVariants} className="bg-white rounded-sm border border-soft p-5 md:p-6 shadow-sm">
            <h2 className="font-display text-lg mb-6 text-dark">Order Tracker</h2>
            <div className="relative pl-3 space-y-6">
              {/* Vertical Line */}
              <div className="absolute left-[17px] top-2 bottom-2 w-[1px] bg-soft z-0"></div>
              
              {[
                { label:'Order Placed',     date: order.createdAt, done: true  },
                { label:'Payment Verified', date: order.paidAt,    done: order.isPaid, note: order.isPaid?'Processed':'Awaiting Payment' },
                { label:'Shipped',          date: null,            done: ['shipped','out_for_delivery','delivered'].includes(order.deliveryStatus) },
                { label:'Delivered',        date: order.deliveredAt,done: order.deliveryStatus==='delivered' },
              ].map(({ label, date, done, note }, idx) => (
                <div key={label} className="relative z-10 flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white transition-colors duration-300
                    ${done ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                    {done && <FiCheckCircle size={12} className="text-white"/>}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-bold tracking-wide transition-colors ${done ? 'text-dark' : 'text-muted'}`}>{label}</p>
                    {date && <p className="text-[10px] font-medium text-muted tracking-widest uppercase mt-1">
                      {new Date(date).toLocaleDateString('en-IN',{day:'2-digit',month:'short', hour:'2-digit', minute:'2-digit'})}
                    </p>}
                    {note && !date && <p className="text-[10px] font-bold text-amber-600 tracking-widest uppercase mt-1">{note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}