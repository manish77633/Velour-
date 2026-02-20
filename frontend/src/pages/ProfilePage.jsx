import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProfile, logout } from '../redux/slices/authSlice';
import { formatPrice } from '../utils/formatPrice';
import api from '../services/api';
import {
  FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut,
  FiChevronRight, FiPlus, FiX, FiEdit2, FiTrash2, FiCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_STYLE = {
  delivered:        'bg-green-100 text-green-700',
  shipped:          'bg-blue-100 text-blue-700',
  processing:       'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  cancelled:        'bg-red-100 text-red-700',
  confirmed:        'bg-teal-100 text-teal-700',
};

const EMPTY_ADDR = {
  label: 'Home', fullName: '', phone: '',
  street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false,
};

export default function ProfilePage() {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();
  const { user }        = useSelector((s) => s.auth);

  const [tab,          setTab]          = useState(searchParams.get('tab') || 'orders');
  const [orders,       setOrders]       = useState([]);
  const [form,         setForm]         = useState({ name: '', phone: '' });
  const [saving,       setSaving]       = useState(false);
  const [addresses,    setAddresses]    = useState([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editAddrId,   setEditAddrId]   = useState(null);
  const [addrForm,     setAddrForm]     = useState(EMPTY_ADDR);
  const [addrSaving,   setAddrSaving]   = useState(false);

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
    setAddrForm({ label: addr.label||'Home', fullName: addr.fullName||'', phone: addr.phone||'',
      street: addr.street||'', city: addr.city||'', state: addr.state||'',
      pincode: addr.pincode||'', country: addr.country||'India', isDefault: addr.isDefault||false });
    setEditAddrId(addr._id); setShowAddrForm(true);
  };

  const handleAddrSave = async () => {
    const req = ['fullName','phone','street','city','state','pincode'];
    for (const f of req) { if (!addrForm[f]?.trim()) { toast.error(`Please fill in ${f === 'fullName' ? 'full name' : f}`); return; } }
    if (!/^\d{10}$/.test(addrForm.phone))  { toast.error('Enter valid 10-digit phone'); return; }
    if (!/^\d{6}$/.test(addrForm.pincode)) { toast.error('Enter valid 6-digit pincode'); return; }
    setAddrSaving(true);
    try {
      if (editAddrId) await api.delete(`/users/address/${editAddrId}`);
      const { data } = await api.post('/users/address', addrForm);
      setAddresses(data.addresses);
      dispatch(fetchProfile());
      toast.success(editAddrId ? 'Address updated!' : 'Address added!');
      setShowAddrForm(false); setEditAddrId(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save address'); }
    finally { setAddrSaving(false); }
  };

  const handleAddrDelete = async (addrId) => {
    try {
      const { data } = await api.delete(`/users/address/${addrId}`);
      setAddresses(data.addresses); dispatch(fetchProfile()); toast.success('Address deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const NAV = [
    { id: 'orders',   label: 'My Orders', icon: FiPackage  },
    { id: 'wishlist', label: 'Wishlist',  icon: FiHeart    },
    { id: 'address',  label: 'Addresses', icon: FiMapPin   },
    { id: 'settings', label: 'Settings',  icon: FiSettings },
  ];

  return (
    <main className="pt-16 min-h-screen bg-cream">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-sm p-6 text-center mb-4">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden">
                {user?.profilePicture
                  ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full bg-gradient-to-br from-warm to-accent flex items-center justify-center text-white font-display text-3xl">{user?.name?.[0]?.toUpperCase()}</div>}
              </div>
              <p className="font-display text-lg">{user?.name}</p>
              <p className="text-xs text-muted mt-0.5 truncate">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] px-3 py-0.5 bg-soft rounded-full text-warm tracking-wider uppercase">✦ Member</span>
            </div>
            <nav className="bg-white rounded-sm overflow-hidden">
              {NAV.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm border-b border-soft last:border-0 transition-all
                    ${tab===id ? 'border-l-2 border-l-warm bg-cream text-dark font-medium pl-[18px]' : 'text-muted hover:bg-cream hover:text-dark'}`}>
                  <span className="flex items-center gap-2.5"><Icon size={15}/>{label}</span>
                  <FiChevronRight size={13}/>
                </button>
              ))}
              <button onClick={() => { dispatch(logout()); navigate('/'); }}
                className="w-full flex items-center gap-2.5 px-5 py-3.5 text-sm text-red-400 hover:bg-red-50 transition-colors">
                <FiLogOut size={15}/> Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* ORDERS */}
            {tab === 'orders' && (
              <div className="bg-white rounded-sm p-6">
                <h2 className="font-display text-2xl mb-5 pb-4 border-b border-soft">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FiPackage size={40} className="text-muted/25 mx-auto mb-3"/>
                    <p className="text-muted text-sm">No orders yet</p>
                    <button onClick={() => navigate('/shop')} className="btn-primary mt-4 py-2 px-5 text-xs">Start Shopping</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order._id} onClick={() => navigate(`/order-success/${order._id}`)}
                        className="flex items-center gap-4 p-4 border border-soft rounded-sm hover:border-warm transition-all cursor-pointer">
                        <div className="w-16 h-20 bg-soft rounded-sm overflow-hidden flex-shrink-0">
                          {order.orderItems?.[0]?.image
                            ? <img src={order.orderItems[0].image} alt="" className="w-full h-full object-cover"/>
                            : <div className="w-full h-full flex items-center justify-center"><FiPackage className="text-muted/30" size={20}/></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted">#{String(order._id).slice(-8).toUpperCase()}</p>
                          <p className="text-sm font-medium truncate">{order.orderItems?.[0]?.name}{order.orderItems?.length > 1 && ` +${order.orderItems.length-1} more`}</p>
                          <p className="text-xs text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                          <p className="text-xs text-muted">{order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold mb-1.5">{formatPrice(order.totalPrice)}</p>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-medium ${STATUS_STYLE[order.deliveryStatus]||'bg-soft text-muted'}`}>
                            {order.deliveryStatus?.replace(/_/g,' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST */}
            {tab === 'wishlist' && (
              <div className="bg-white rounded-sm p-6">
                <h2 className="font-display text-2xl mb-5 pb-4 border-b border-soft">My Wishlist</h2>
                <div className="text-center py-10">
                  <FiHeart size={36} className="text-muted/25 mx-auto mb-3"/>
                  <p className="text-sm text-muted">No saved items yet</p>
                  <button onClick={() => navigate('/shop')} className="btn-outline mt-4 py-2 px-5 text-xs">Browse Products</button>
                </div>
              </div>
            )}

            {/* ADDRESSES */}
            {tab === 'address' && (
              <div className="bg-white rounded-sm p-6">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-soft">
                  <h2 className="font-display text-2xl">Saved Addresses</h2>
                  {!showAddrForm && (
                    <button onClick={openAddForm} className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5">
                      <FiPlus size={13}/> Add New
                    </button>
                  )}
                </div>

                {/* Address Form */}
                {showAddrForm && (
                  <div className="bg-soft rounded-sm p-5 mb-5 border border-soft/80">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-sm">{editAddrId ? 'Edit Address' : 'New Address'}</h3>
                      <button onClick={() => { setShowAddrForm(false); setEditAddrId(null); }} className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center"><FiX size={14}/></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Label */}
                      <div className="col-span-2">
                        <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wider">Label</label>
                        <div className="flex gap-2">
                          {['Home','Office','Other'].map((l) => (
                            <button key={l} type="button" onClick={() => setAddrForm((f) => ({...f, label:l}))}
                              className={`px-4 py-1.5 text-xs border rounded-sm transition-all ${addrForm.label===l ? 'bg-dark text-white border-dark' : 'border-soft bg-white hover:border-dark'}`}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Fields */}
                      {[
                        { key:'fullName', label:'Full Name *',       ph:'Manish Kumar',  col:1 },
                        { key:'phone',    label:'Phone (10 digits)*', ph:'9876543210',    col:1 },
                        { key:'street',   label:'Street Address *',   ph:'123, MG Road',  col:2 },
                        { key:'city',     label:'City *',             ph:'Mumbai',        col:1 },
                        { key:'state',    label:'State *',            ph:'Maharashtra',   col:1 },
                        { key:'pincode',  label:'PIN Code *',         ph:'400001',        col:1 },
                        { key:'country',  label:'Country',            ph:'India',         col:1 },
                      ].map(({ key, label, ph, col }) => (
                        <div key={key} className={col===2 ? 'col-span-2' : ''}>
                          <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wider">{label}</label>
                          <input value={addrForm[key]}
                            onChange={(e) => {
                              let v = e.target.value;
                              if (key==='phone'||key==='pincode') v = v.replace(/\D/g,'');
                              setAddrForm((f) => ({...f, [key]:v}));
                            }}
                            maxLength={key==='phone'?10:key==='pincode'?6:undefined}
                            className="input-field bg-white" placeholder={ph}/>
                        </div>
                      ))}
                      {/* Default checkbox */}
                      <div className="col-span-2">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <button type="button" onClick={() => setAddrForm((f) => ({...f, isDefault:!f.isDefault}))}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${addrForm.isDefault ? 'bg-warm border-warm' : 'border-gray-300 bg-white'}`}>
                            {addrForm.isDefault && <FiCheck size={11} className="text-white"/>}
                          </button>
                          <span className="text-sm">Set as default address</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4 pt-3 border-t border-soft/60">
                      <button onClick={handleAddrSave} disabled={addrSaving}
                        className="btn-primary py-2.5 px-6 text-xs disabled:opacity-60 flex items-center gap-1.5">
                        {addrSaving
                          ? <><span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin"/>{editAddrId?'Updating...':'Saving...'}</>
                          : <><FiCheck size={13}/>{editAddrId?'Update Address':'Save Address'}</>}
                      </button>
                      <button onClick={() => {setShowAddrForm(false);setEditAddrId(null);}} className="btn-outline py-2.5 px-5 text-xs">Cancel</button>
                    </div>
                  </div>
                )}

                {/* Address List */}
                {addresses.length === 0 && !showAddrForm ? (
                  <div className="text-center py-10">
                    <FiMapPin size={36} className="text-muted/25 mx-auto mb-3"/>
                    <p className="text-sm text-muted mb-4">No saved addresses</p>
                    <button onClick={openAddForm} className="btn-primary py-2 px-5 text-xs inline-flex items-center gap-1.5"><FiPlus size={13}/> Add Address</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {addresses.map((addr) => (
                      <div key={addr._id} className={`border rounded-sm p-4 relative transition-all ${addr.isDefault ? 'border-warm bg-warm/5' : 'border-soft hover:border-warm/50'}`}>
                        {addr.isDefault && <span className="absolute top-3 right-3 text-[10px] bg-warm text-white px-2 py-0.5 rounded-full">Default</span>}
                        <p className="text-xs font-semibold tracking-wider uppercase text-warm mb-2">
                          {addr.label==='Home'?'🏠':addr.label==='Office'?'🏢':'📍'} {addr.label}
                        </p>
                        <p className="text-sm font-medium">{addr.fullName}</p>
                        <p className="text-sm text-muted leading-relaxed mt-0.5">
                          {addr.street}<br/>{addr.city}, {addr.state} — {addr.pincode}<br/>📞 {addr.phone}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => openEditForm(addr)} className="flex items-center gap-1 text-xs border border-soft px-3 py-1.5 rounded-sm hover:border-warm hover:text-warm transition-all"><FiEdit2 size={11}/> Edit</button>
                          <button onClick={() => handleAddrDelete(addr._id)} className="flex items-center gap-1 text-xs border border-soft px-3 py-1.5 rounded-sm hover:border-red-400 hover:text-red-400 transition-all"><FiTrash2 size={11}/> Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {tab === 'settings' && (
              <div className="bg-white rounded-sm p-6">
                <h2 className="font-display text-2xl mb-5 pb-4 border-b border-soft">Account Settings</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-xs tracking-[0.12em] uppercase text-muted mb-1.5 font-medium">Full Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm((f)=>({...f,name:e.target.value}))} className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.12em] uppercase text-muted mb-1.5 font-medium">Email</label>
                    <input type="email" value={user?.email||''} disabled className="input-field opacity-60 cursor-not-allowed"/>
                    <p className="text-xs text-muted mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.12em] uppercase text-muted mb-1.5 font-medium">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm((f)=>({...f,phone:e.target.value}))} placeholder="+91 98765 43210" className="input-field"/>
                  </div>
                  <button onClick={handleSaveProfile} disabled={saving} className="btn-primary py-2.5 px-6 text-xs disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
