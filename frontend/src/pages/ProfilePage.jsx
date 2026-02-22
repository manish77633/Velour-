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
  FiChevronRight, FiPlus, FiEdit2, FiTrash2, FiShoppingBag, FiX
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

const EMPTY_ADDR = { label: 'Home', fullName: '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false };

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Redux Data
  const { user } = useSelector((s) => s.auth);
  const { wishlistItems } = useSelector((s) => s.wishlist || { wishlistItems: [] });

  const [tab, setTab] = useState(searchParams.get('tab') || 'orders');
  const [orders, setOrders] = useState([]);
  
  // Profile Form State
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  
  // Password Form State
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passSaving, setPassSaving] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editAddrId, setEditAddrId] = useState(null);
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR);
  const [addrSaving, setAddrSaving] = useState(false);

  // Init Data
  useEffect(() => {
    dispatch(fetchProfile());
    api.get('/orders/my-orders').then(({ data }) => setOrders(data.orders)).catch(() => {});
  }, [dispatch]);

  // Sync User Data to Local State
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleTabChange = (id) => { setTab(id); navigate(`/profile?tab=${id}`, { replace: true }); };

  // ── 1. UPDATE PROFILE INFO ──
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      dispatch(fetchProfile());
      toast.success('Profile updated successfully!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } 
    finally { setSaving(false); }
  };

  // ── 2. CHANGE PASSWORD ──
  const handleUpdatePassword = async () => {
    if (!passForm.currentPassword || !passForm.newPassword) return toast.error("All fields required");
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error("Passwords do not match");
    setPassSaving(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      toast.success('Password updated successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update password'); } 
    finally { setPassSaving(false); }
  };

  // ── 3. ADDRESS FUNCTIONS ──
  const openAddForm = () => { setAddrForm(EMPTY_ADDR); setEditAddrId(null); setShowAddrForm(true); };
  
  const openEditForm = (addr) => { setAddrForm({ ...addr }); setEditAddrId(addr._id); setShowAddrForm(true); };
  
  const handleAddrSave = async () => {
    const req = ['fullName','phone','street','city','state','pincode'];
    for (const f of req) { if (!addrForm[f]?.trim()) { toast.error(`Please fill in ${f}`); return; } }
    
    setAddrSaving(true);
    try {
      // Logic: Backend me 'Update Address' nahi hai, to Delete old -> Add New karte hain
      if (editAddrId) await api.delete(`/users/address/${editAddrId}`);
      
      const { data } = await api.post('/users/address', addrForm);
      setAddresses(data.addresses);
      dispatch(fetchProfile());
      toast.success(editAddrId ? 'Address updated!' : 'Address added!');
      setShowAddrForm(false); setEditAddrId(null);
    } catch (err) { toast.error('Failed to save address'); }
    finally { setAddrSaving(false); }
  };

  const handleAddrDelete = async (id) => {
    if(!window.confirm("Delete this address?")) return;
    try {
      await api.delete(`/users/address/${id}`);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      dispatch(fetchProfile());
      toast.success('Address deleted!');
    } catch (err) { toast.error('Failed to delete address'); }
  };

  const NAV = [
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'address', label: 'Addresses', icon: FiMapPin },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <main className="pt-20 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-soft">
               <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-warm p-1">
                     {user?.profilePicture 
                      ? <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover"/>
                      : <div className="w-full h-full bg-[#1C1917] rounded-full flex items-center justify-center text-[#C4A882] font-display text-4xl">{user?.name?.[0]}</div>
                     }
                  </div>
               </div>
               <h2 className="font-display text-xl text-dark uppercase tracking-tight">{user?.name}</h2>
               <p className="text-xs text-muted mb-3">{user?.email}</p>
            </div>
            
            <nav className="bg-white rounded-xl shadow-sm border border-soft overflow-hidden">
              {NAV.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => handleTabChange(id)} className={`w-full flex items-center justify-between px-6 py-4 text-sm transition-all ${tab===id ? 'bg-[#1C1917] text-[#C4A882]' : 'text-muted hover:bg-cream hover:text-dark'}`}>
                  <span className="flex items-center gap-3"><Icon size={16}/>{label}</span>
                  <FiChevronRight size={14} className={tab===id ? 'opacity-100' : 'opacity-30'}/>
                </button>
              ))}
              <button onClick={() => { dispatch(logout()); navigate('/'); }} className="w-full flex items-center gap-3 px-6 py-4 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-soft">
                <FiLogOut size={16}/> Sign Out
              </button>
            </nav>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                
                {/* 1. ORDERS TAB */}
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
                          <div key={order._id} onClick={() => navigate(`/order-success/${order._id}`)} className="group flex flex-col md:flex-row md:items-center gap-6 p-5 border border-soft rounded-lg hover:border-warm transition-all cursor-pointer">
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
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. WISHLIST TAB */}
                {tab === 'wishlist' && (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-soft">
                    <h2 className="font-display text-2xl mb-8 border-b border-soft pb-4">Saved Pieces</h2>
                    {wishlistItems?.length === 0 ? (
                      <div className="text-center py-20">
                        <FiHeart size={50} className="text-soft mx-auto mb-4"/>
                        <p className="text-muted mb-6">Your wishlist is empty.</p>
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
                            <button onClick={() => { dispatch(removeFromWishlist(item._id)); toast.success("Removed from wishlist"); }} className="p-2 text-muted hover:text-red-500 transition-colors">
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. ADDRESS TAB */}
                {tab === 'address' && (
                   <div className="bg-white rounded-xl p-8 shadow-sm border border-soft">
                      <div className="flex justify-between items-center mb-8 border-b border-soft pb-4">
                        <h2 className="font-display text-2xl">Addresses</h2>
                        {!showAddrForm && <button onClick={openAddForm} className="bg-dark text-white px-4 py-2 text-[10px] uppercase tracking-widest flex items-center gap-2"><FiPlus/> Add New</button>}
                      </div>
                      
                      {showAddrForm && (
                        <div className="bg-cream/30 p-6 rounded-lg border border-soft mb-8">
                           <h3 className="text-sm font-bold uppercase mb-4 tracking-wider">{editAddrId ? 'Edit Address' : 'New Address'}</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="text" placeholder="Full Name" value={addrForm.fullName} onChange={e=>setAddrForm({...addrForm, fullName: e.target.value})} className="w-full border-b border-soft py-2 focus:border-warm outline-none bg-transparent" />
                             <input type="tel" placeholder="Phone" value={addrForm.phone} onChange={e=>setAddrForm({...addrForm, phone: e.target.value})} className="w-full border-b border-soft py-2 focus:border-warm outline-none bg-transparent" />
                             <input type="text" placeholder="Street" value={addrForm.street} onChange={e=>setAddrForm({...addrForm, street: e.target.value})} className="w-full border-b border-soft py-2 focus:border-warm outline-none bg-transparent md:col-span-2" />
                             <input type="text" placeholder="City" value={addrForm.city} onChange={e=>setAddrForm({...addrForm, city: e.target.value})} className="w-full border-b border-soft py-2 focus:border-warm outline-none bg-transparent" />
                             <input type="text" placeholder="State" value={addrForm.state} onChange={e=>setAddrForm({...addrForm, state: e.target.value})} className="w-full border-b border-soft py-2 focus:border-warm outline-none bg-transparent" />
                             <input type="text" placeholder="Pincode" value={addrForm.pincode} onChange={e=>setAddrForm({...addrForm, pincode: e.target.value})} className="w-full border-b border-soft py-2 focus:border-warm outline-none bg-transparent" />
                           </div>
                           <div className="flex gap-4 mt-6">
                              <button onClick={handleAddrSave} disabled={addrSaving} className="bg-dark text-white px-6 py-2 text-xs uppercase tracking-widest">{addrSaving ? 'Saving...' : 'Save Address'}</button>
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

                {/* 4. SETTINGS TAB */}
                {tab === 'settings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Edit Info */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-soft h-fit">
                      <h2 className="font-display text-2xl mb-6 border-b border-soft pb-4">Edit Profile</h2>
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted">Full Name</label>
                            <input type="text" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border-b border-soft py-2 outline-none bg-transparent" placeholder="Name"/>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted">Contact Phone</label>
                            <input type="tel" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} className="w-full border-b border-soft py-2 outline-none bg-transparent" placeholder="Phone"/>
                         </div>
                         <button onClick={handleSaveProfile} disabled={saving} className="bg-[#1C1917] text-[#C4A882] w-full py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-all">
                            {saving ? 'Processing...' : 'Save Profile Details'}
                         </button>
                      </div>
                    </div>

                    {/* Right: Change Password */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-soft h-fit">
                      <h2 className="font-display text-2xl mb-6 border-b border-soft pb-4">Change Password</h2>
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted">Current Password</label>
                            <input type="password" value={passForm.currentPassword} onChange={(e)=>setPassForm({...passForm, currentPassword:e.target.value})} className="w-full border-b border-soft py-2 outline-none bg-transparent" placeholder="Current Password"/>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted">New Password</label>
                            <input type="password" value={passForm.newPassword} onChange={(e)=>setPassForm({...passForm, newPassword:e.target.value})} className="w-full border-b border-soft py-2 outline-none bg-transparent" placeholder="New Password"/>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted">Confirm New Password</label>
                            <input type="password" value={passForm.confirmPassword} onChange={(e)=>setPassForm({...passForm, confirmPassword:e.target.value})} className="w-full border-b border-soft py-2 outline-none bg-transparent" placeholder="Confirm Password"/>
                         </div>
                         <button onClick={handleUpdatePassword} disabled={passSaving} className="border border-[#1C1917] text-[#1C1917] w-full py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#1C1917] hover:text-[#C4A882] transition-colors">
                           {passSaving ? 'Updating...' : 'Update Password'}
                         </button>
                      </div>
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