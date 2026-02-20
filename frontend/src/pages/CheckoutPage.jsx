import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpayHelper';
import api from '../services/api';
import { FiLock, FiCheck, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const INIT_ADDRESS = { fullName:'', phone:'', street:'', city:'', state:'', pincode:'', country:'India' };

export default function CheckoutPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);
  const { items, totalPrice } = useSelector((s) => s.cart);

  // Pre-fill from saved addresses
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [address,   setAddress]   = useState({
    ...INIT_ADDRESS,
    fullName: defaultAddr?.fullName || user?.name  || '',
    phone:    defaultAddr?.phone    || user?.phone || '',
    street:   defaultAddr?.street   || '',
    city:     defaultAddr?.city     || '',
    state:    defaultAddr?.state    || '',
    pincode:  defaultAddr?.pincode  || '',
    country:  defaultAddr?.country  || 'India',
  });
  const [payMethod, setPayMethod] = useState('razorpay'); // 'razorpay' | 'cod'
  const [loading,   setLoading]   = useState(false);
  const [selectedSavedAddr, setSelectedSavedAddr] = useState(defaultAddr?._id || '');

  const shippingCharge = totalPrice >= 999 ? 0 : 99;
  const taxPrice       = Math.round(totalPrice * 0.05);
  const total          = totalPrice + shippingCharge + taxPrice;

  const handleAddressChange = (e) => setAddress((a) => ({...a, [e.target.name]: e.target.value}));

  const useSavedAddress = (addr) => {
    setSelectedSavedAddr(addr._id);
    setAddress({ fullName: addr.fullName, phone: addr.phone, street: addr.street,
      city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country });
  };

  const validateAddress = () => {
    const req = ['fullName','phone','street','city','state','pincode'];
    for (const f of req) {
      if (!address[f]?.trim()) { toast.error(`Please fill in ${f.replace('fullName','full name')}`); return false; }
    }
    if (!/^\d{10}$/.test(address.phone))  { toast.error('Enter valid 10-digit phone'); return false; }
    if (!/^\d{6}$/.test(address.pincode)) { toast.error('Enter valid 6-digit PIN code'); return false; }
    return true;
  };

  // ── COD Order ─────────────────────────────────────────────
  const placeCODOrder = async () => {
    try {
      const { data } = await api.post('/orders/place-cod', {
        orderItems: items.map((i) => ({
          product: i.productId, name: i.name, image: i.image,
          price: i.price, size: i.size, color: i.color, quantity: i.qty,
        })),
        shippingAddress: address,
        itemsPrice:    totalPrice,
        shippingPrice: shippingCharge,
        taxPrice,
        totalPrice:    total,
      });
      dispatch(clearCart());
      toast.success('Order placed! Pay on delivery 🎉');
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  // ── Razorpay Order ────────────────────────────────────────
  const placeRazorpayOrder = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error('Razorpay SDK failed to load');

    const { data: orderData } = await api.post('/orders/create-razorpay-order', { amount: total });
    const paymentResponse = await openRazorpayCheckout({
      key:      process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount:   orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name:     'VELOUR',
      description: `Order of ${items.length} item(s)`,
      prefill:  { name: user?.name, email: user?.email, contact: address.phone },
      theme:    { color: '#8B6F5C' },
    });

    const { data: verifyData } = await api.post('/orders/verify-payment', {
      razorpay_order_id:   paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature:  paymentResponse.razorpay_signature,
      orderItems: items.map((i) => ({
        product: i.productId, name: i.name, image: i.image,
        price: i.price, size: i.size, color: i.color, quantity: i.qty,
      })),
      shippingAddress: address,
      itemsPrice: totalPrice, shippingPrice: shippingCharge, taxPrice, totalPrice: total,
    });

    dispatch(clearCart());
    toast.success('Payment successful! 🎉');
    navigate(`/order-success/${verifyData.order._id}`);
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;
    if (!items.length)      return toast.error('Your cart is empty');
    setLoading(true);
    try {
      if (payMethod === 'cod') await placeCODOrder();
      else                     await placeRazorpayOrder();
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <main className="pt-16 min-h-screen bg-cream">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── FORM ── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Saved Addresses Quick Select */}
            {user?.addresses?.length > 0 && (
              <div className="bg-white rounded-sm p-5 border border-soft">
                <h2 className="font-display text-lg mb-3">Saved Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {user.addresses.map((addr) => (
                    <button key={addr._id} onClick={() => useSavedAddress(addr)} type="button"
                      className={`text-left p-3 border rounded-sm transition-all ${selectedSavedAddr===addr._id ? 'border-warm bg-warm/5' : 'border-soft hover:border-warm/50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-warm uppercase tracking-wide">{addr.label}</span>
                        {selectedSavedAddr===addr._id && <FiCheck size={13} className="text-warm"/>}
                      </div>
                      <p className="text-xs font-medium">{addr.fullName}</p>
                      <p className="text-xs text-muted">{addr.city}, {addr.state} · {addr.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Shipping */}
            <div className="bg-white rounded-sm p-6 border border-soft">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-dark text-white flex items-center justify-center text-xs font-semibold">1</div>
                <h2 className="font-display text-xl">Contact & Shipping</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name:'fullName', label:'Full Name *',       ph:'Manish Kumar',   full:false },
                  { name:'phone',    label:'Phone *',           ph:'9876543210',     full:false },
                  { name:'street',   label:'Street Address *',  ph:'123, MG Road',   full:true  },
                  { name:'city',     label:'City *',            ph:'Mumbai',         full:false },
                  { name:'state',    label:'State *',           ph:'Maharashtra',    full:false },
                  { name:'pincode',  label:'PIN Code *',        ph:'400001',         full:false },
                ].map(({ name, label, ph, full }) => (
                  <div key={name} className={full ? 'md:col-span-2' : ''}>
                    <label className="block text-xs tracking-[0.12em] uppercase text-muted mb-1.5 font-medium">{label}</label>
                    <input name={name} value={address[name]} onChange={handleAddressChange}
                      placeholder={ph} className="input-field"
                      maxLength={name==='phone'?10:name==='pincode'?6:undefined}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-sm p-6 border border-soft">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-dark text-white flex items-center justify-center text-xs font-semibold">2</div>
                <h2 className="font-display text-xl">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                {[
                  { id:'razorpay', label:'Online Payment', icon:'💳', sub:'Cards, UPI, Net Banking' },
                  { id:'cod',      label:'Cash on Delivery',icon:'💵', sub:'Pay when delivered'     },
                ].map((m) => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)} type="button"
                    className={`flex flex-col items-start gap-1 p-4 border rounded-sm text-left transition-all col-span-1
                      ${payMethod===m.id ? 'border-warm bg-warm/5 ring-1 ring-warm' : 'border-soft hover:border-warm'}`}>
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-xl">{m.icon}</span>
                      <span className="text-sm font-semibold">{m.label}</span>
                      {payMethod===m.id && <FiCheck size={14} className="text-warm ml-auto"/>}
                    </div>
                    <span className="text-xs text-muted">{m.sub}</span>
                  </button>
                ))}
              </div>

              {payMethod === 'razorpay' && (
                <div className="bg-green-50 border border-green-200 rounded-sm p-3 flex gap-2.5">
                  <FiLock size={14} className="text-green-600 flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="text-xs font-medium text-green-800">Secured by Razorpay</p>
                    <p className="text-xs text-green-700 mt-0.5">HMAC-SHA256 signature verified. We never store card details.</p>
                  </div>
                </div>
              )}
              {payMethod === 'cod' && (
                <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 flex gap-2.5">
                  <FiTruck size={14} className="text-amber-600 flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="text-xs font-medium text-amber-800">Cash on Delivery</p>
                    <p className="text-xs text-amber-700 mt-0.5">Keep exact change ready. Pay in cash when your order arrives.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Place Order Button */}
            <button onClick={handlePlaceOrder} disabled={loading}
              className="btn-primary w-full justify-center py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  {payMethod==='cod' ? 'Placing Order...' : 'Processing Payment...'}
                </span>
              ) : payMethod === 'cod'
                  ? <><FiTruck size={15}/> Place Order (Pay on Delivery)</>
                  : <><FiLock size={14}/> Pay {formatPrice(total)} Securely</>}
            </button>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="lg:col-span-2 sticky top-24">
            <div className="bg-white rounded-sm p-6 border border-soft">
              <h2 className="font-display text-xl mb-5 pb-4 border-b border-soft">Order Summary</h2>
              <div className="space-y-3 mb-5 pb-5 border-b border-soft max-h-64 overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-3 items-center">
                    <div className="w-14 h-16 bg-soft rounded-sm overflow-hidden flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted">Size: {item.size} · Qty: {item.qty}</p>
                    </div>
                    <p className="text-xs font-semibold flex-shrink-0">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Shipping</span><span className={shippingCharge===0?'text-green-600':''}>{shippingCharge===0?'Free':formatPrice(shippingCharge)}</span></div>
                <div className="flex justify-between"><span className="text-muted">GST (5%)</span><span>{formatPrice(taxPrice)}</span></div>
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-soft">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-soft rounded-sm">
                <p className="text-xs text-muted font-medium">Payment: <span className="text-dark">{payMethod==='cod'?'Cash on Delivery':'Online (Razorpay)'}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
