import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProfile, logout } from '../redux/slices/authSlice';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { formatPrice } from '../utils/formatPrice';
import api from '../services/api';
import {
  FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut,
  FiChevronRight, FiPlus, FiX, FiEdit2, FiTrash2, FiShoppingBag
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_STYLE = {
  delivered: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  confirmed: 'bg-teal-100 text-teal-700',
};

const EMPTY_ADDR = {
  label: 'Home', fullName: '', phone: '',
  street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false,
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Redux States
  const { user } = useSelector((s) => s.auth);
  const { wishlistItems } = useSelector((s) => s.wishlist || { wishlistItems: [] });

  const [tab, setTab] = useState(searchParams.get('tab') || 'orders');
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editAddrId, setEditAddrId] = useState(null);
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR);
  const [addrSaving, setAddrSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    api.get('/orders/my-orders').then(({ data }) => setOrders(data.orders)).catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab) setTab(urlTab);
  }, [searchParams]);

  const handleTabChange = (id) => {
    setTab(id);
    navigate(`/profile?tab=${id}`, { replace: true });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      dispatch(fetchProfile());
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  const openAddForm = () => { setAddrForm(EMPTY_ADDR); setEditAddrId(null); setShowAddrForm(true); };
  
  const openEditForm = (addr) => {
    setAddrForm({ ...addr });
    setEditAddrId(addr._id); 
    setShowAddrForm(true);
  };

  const handleAddrSave = async () => {
    const req = ['fullName','phone','street','city','state','pincode'];
    for (const f of req) { if (!addrForm[f]?.trim()) { toast.error(`Please fill in ${f}`); return; } }
    setAddrSaving(true);
    try {
      if (editAddrId) await api.delete(`/users/address/${editAddrId}`);
      const { data } = await api.post('/users/address', addrForm);
      setAddresses(data.addresses);
      dispatch(fetchProfile());
      toast.success(editAddrId ? 'Address updated!' : 'Address added!');
      setShowAddrForm(false); setEditAddrId(null);
    } catch (err) { toast.error('Failed to save address'); }
    finally { setAddrSaving(false); }
  };

  const NAV = [
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'address', label: 'Addresses', icon: FiMapPin },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <main className="pt-20 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-soft">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-warm p-1">
                   {user?.profilePicture 
                    ? <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover"/>
                    : <div className="w-full h-full bg-[#1C1917] rounded-full flex items-center justify-center text-[#C4A882] font-display text-4xl">{user?.name?.[0]}</div>
                   }
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-soft text-warm hover:text-dark transition-colors">
                  <FiEdit2 size={12}/>
                </button>
              </div>
              <h2 className="font-display text-xl text-dark uppercase tracking-tight">{user?.name}</h2>
              <p className="text-xs text-muted mb-3">{user?.email}</p>
              <span className="text-[9px] px-3 py-1 bg-warm/10 text-warm rounded-full font-bold uppercase tracking-widest">Premium Member</span>
            </div>

            <nav className="bg-white rounded-xl shadow-sm border border-soft overflow-hidden">
              {NAV.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => handleTabChange(id)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-sm transition-all
                    ${tab===id ? 'bg-[#1C1917] text-[#C4A882]' : 'text-muted hover:bg-cream hover:text-dark'}`}>
                  <span className="flex items-center gap-3"><Icon size={16}/>{label}</span>
                  <FiChevronRight size={14} className={tab===id ? 'opacity-100' : 'opacity-30'}/>
                </button>
              ))}
              <button onClick={() => { dispatch(logout()); navigate('/'); }}
                className="w-full flex items-center gap-3 px-6 py-4 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-soft">
                <FiLogOut size={16}/> Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={tab} variants={tabVariants} initial="hidden" animate="visible" exit="hidden">
                
                {/* ORDERS TAB */}
                {tab === 'orders' && (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-soft">
                    <h2 className="font-display text-2xl mb-8 border-b border-soft pb-4">Order History</h2>
                    {orders.length === 0 ? (
                      <div className="text-center py-20">
                        <FiPackage size={50} className="text-soft mx-auto mb-4"/>
                        <p className="text-muted mb-6">You haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/shop')} className="bg-[#1C1917] text-[#C4A882] px-8 py-3 text-xs uppercase tracking-widest hover:bg-black transition-all">Start Shopping</button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order._id} onClick={() => navigate(`/order-success/${order._id}`)}
                            className="group flex flex-col md:flex-row md:items-center gap-6 p-5 border border-soft rounded-lg hover:border-warm transition-all cursor-pointer">
                            <div className="w-20 h-24 bg-soft rounded flex-shrink-0">
                              <img src={order.orderItems?.[0]?.image} alt="Order" className="w-full h-full object-cover rounded opacity-90 group-hover:opacity-100"/>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] text-muted font-mono">ID: {order._id.slice(-8).toUpperCase()}</span>
                                <span className={`text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${STATUS_STYLE[order.deliveryStatus] || 'bg-gray-100'}`}>
                                  {order.deliveryStatus.replace('_', ' ')}
                                </span>
                              </div>
                              <h4 className="text-sm font-medium mb-1 truncate">{order.orderItems?.[0]?.name} {order.orderItems.length > 1 && `+${order.orderItems.length-1} more`}</h4>
                              <p className="text-xs text-muted">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="md:text-right">
                              <p className="text-lg font-display text-dark">{formatPrice(order.totalPrice)}</p>
                              <p className="text-[10px] text-warm uppercase mt-1">View Details →</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* WISHLIST TAB */}
                {tab === 'wishlist' && (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-soft">
                    <h2 className="font-display text-2xl mb-8 border-b border-soft pb-4">Saved Pieces</h2>
                    {wishlistItems?.length === 0 ? (
                      <div className="text-center py-20">
                        <FiHeart size={50} className="text-soft mx-auto mb-4"/>
                        <p className="text-muted mb-6">Your wishlist is empty.</p>
                        <button onClick={() => navigate('/shop')} className="border border-dark px-8 py-3 text-xs uppercase tracking-widest hover:bg-dark hover:text-white transition-all">Explore Collection</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlistItems.map((item) => (
                          <div key={item._id} className="flex items-center justify-between p-4 border border-soft rounded-lg group hover:border-warm transition-all">
                            <Link to={`/product/${item._id}`} className="flex items-center gap-4 flex-1">
                              <img src={item.images?.[0] || item.image || '/placeholder.jpg'} alt={item.name} className="w-16 h-20 object-cover rounded"/>
                              <div>
                                <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                                <p className="text-sm text-warm font-semibold mt-1">{formatPrice(item.price)}</p>
                              </div>
                            </Link>
                            <div className="flex flex-col gap-2">
                              <button onClick={() => { dispatch(removeFromWishlist(item._id)); toast.success("Removed from wishlist"); }} className="p-2 text-muted hover:text-red-500 transition-colors" title="Remove">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ADDRESS TAB */}
                {tab === 'address' && (
                   <div className="bg-white rounded-xl p-8 shadow-sm border border-soft">
                      <div className="flex justify-between items-center mb-8 border-b border-soft pb-4">
                        <h2 className="font-display text-2xl">My Addresses</h2>
                        {!showAddrForm && <button onClick={openAddForm} className="bg-dark text-white px-4 py-2 text-[10px] uppercase tracking-widest flex items-center gap-2"><FiPlus/> Add New</button>}
                      </div>
                      
                      {showAddrForm && (
                        <div className="bg-cream/30 p-6 rounded-lg border border-soft mb-8">
                           <h3 className="text-sm font-bold uppercase mb-4 tracking-wider">{editAddrId ? 'Modify Address' : 'New Location'}</h3>
                           {/* Add Address Form Inputs... (Code maintained as is to save space, assuming it worked fine) */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="text" placeholder="Full Name" value={addrForm.fullName} onChange={e=>setAddrForm({...addrForm, fullName: e.target.value})} className="input-field" />
                             <input type="tel" placeholder="Phone Number" value={addrForm.phone} onChange={e=>setAddrForm({...addrForm, phone: e.target.value})} className="input-field" />
                             <input type="text" placeholder="Street Address" value={addrForm.street} onChange={e=>setAddrForm({...addrForm, street: e.target.value})} className="input-field md:col-span-2" />
                             <input type="text" placeholder="City" value={addrForm.city} onChange={e=>setAddrForm({...addrForm, city: e.target.value})} className="input-field" />
                             <input type="text" placeholder="State" value={addrForm.state} onChange={e=>setAddrForm({...addrForm, state: e.target.value})} className="input-field" />
                             <input type="text" placeholder="Pincode" value={addrForm.pincode} onChange={e=>setAddrForm({...addrForm, pincode: e.target.value})} className="input-field" />
                           </div>
                           <div className="flex gap-4 mt-6">
                              <button onClick={handleAddrSave} className="bg-dark text-white px-6 py-2 text-xs uppercase tracking-widest">{addrSaving ? 'Saving...' : 'Save Address'}</button>
                              <button onClick={() => setShowAddrForm(false)} className="text-muted text-xs underline">Cancel</button>
                           </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div key={addr._id} className="p-5 border border-soft rounded-lg relative group hover:border-warm transition-all">
                             {addr.isDefault && <span className="absolute top-4 right-4 text-[8px] bg-warm text-white px-2 py-0.5 rounded uppercase font-bold">Default</span>}
                             <p className="text-[10px] font-bold text-warm uppercase mb-2 tracking-widest">{addr.label}</p>
                             <h4 className="font-medium text-sm mb-1">{addr.fullName}</h4>
                             <p className="text-xs text-muted leading-relaxed mb-4">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                             <div className="flex gap-3 pt-3 border-t border-soft">
                                <button onClick={() => openEditForm(addr)} className="text-[10px] uppercase font-bold flex items-center gap-1 hover:text-warm"><FiEdit2 size={10}/> Edit</button>
                                <button onClick={() => handleAddrDelete(addr._id)} className="text-[10px] uppercase font-bold flex items-center gap-1 hover:text-red-500"><FiTrash2 size={10}/> Delete</button>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                )}

                {/* SETTINGS TAB */}
                {tab === 'settings' && (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-soft">
                    <h2 className="font-display text-2xl mb-8 border-b border-soft pb-4">Account Settings</h2>
                    <div className="max-w-md space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Full Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm((f)=>({...f,name:e.target.value}))} className="w-full border-b border-soft py-2 focus:border-warm outline-none bg-transparent transition-all"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Email Address</label>
                        <input type="email" value={user?.email} disabled className="w-full border-b border-soft py-2 opacity-50 bg-transparent outline-none cursor-not-allowed"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Contact Number</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm((f)=>({...f,phone:e.target.value}))} className="w-full border-b border-soft py-2 focus:border-warm outline-none bg-transparent transition-all"/>
                      </div>
                      <button onClick={handleSaveProfile} disabled={saving} className="bg-[#1C1917] text-[#C4A882] w-full py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-all">
                        {saving ? 'Processing...' : 'Save Profile Details'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}