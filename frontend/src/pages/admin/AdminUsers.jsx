// frontend/src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  FiUsers, FiTrash2, FiShield, FiUser, FiSearch, FiFilter, 
  FiChevronDown, FiMail, FiCalendar, FiActivity, FiX, 
  FiCopy, FiMapPin, FiShoppingBag, FiPhone 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

// Drawer Slide-in Animation
const drawerVariants = {
  hidden: { x: '100%', opacity: 0.5 },
  show: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { x: '100%', opacity: 0.5, transition: { ease: 'easeInOut', duration: 0.3 } }
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState('');
  const [updatingRole, setUpdatingRole] = useState('');
  
  // Modal / Drawer State
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.users || data); 
    } catch (error) { toast.error('Failed to load users'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete account for ${name}?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/users/${id}`);
      toast.success(`${name}'s account deleted.`);
      setUsers(users.filter(u => u._id !== id));
      if (selectedUser?._id === id) setSelectedUser(null);
    } catch (error) { toast.error('Failed to delete user'); } 
    finally { setDeleting(''); }
  };

  const handleRoleChange = async (targetUser, newRoleString) => {
    const newIsAdmin = newRoleString === 'admin';
    if (targetUser.isAdmin === newIsAdmin) return;
    if (!window.confirm(`Change role of ${targetUser.name} to ${newRoleString.toUpperCase()}?`)) return;

    setUpdatingRole(targetUser._id);
    try {
      await api.put(`/users/${targetUser._id}`, { 
        name: targetUser.name, email: targetUser.email, isAdmin: newIsAdmin 
      });
      toast.success(`${targetUser.name} is now an ${newRoleString}`);
      setUsers(users.map(u => u._id === targetUser._id ? { ...u, isAdmin: newIsAdmin } : u));
      if(selectedUser?._id === targetUser._id) {
        setSelectedUser({...selectedUser, isAdmin: newIsAdmin});
      }
    } catch (error) { toast.error('Failed to update role'); } 
    finally { setUpdatingRole(''); }
  };

  // 📋 Copy to Clipboard Utility
  const copyToClipboard = (text, label) => {
    if (!text) return toast.error(`No ${label} available to copy`);
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' ? true : roleFilter === 'admin' ? user.isAdmin : !user.isAdmin;
    return matchesSearch && matchesRole;
  });

  const totalAdmins = users.filter(u => u.isAdmin).length;
  const totalCustomers = users.length - totalAdmins;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 max-w-screen-2xl mx-auto min-h-screen relative">
      
      {/* Premium Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 md:mb-10 gap-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-dark tracking-tight mb-4 md:mb-3">User Directory</h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-5 bg-white px-4 py-3 md:py-2 rounded-sm border border-soft shadow-sm w-fit">
            <p className="text-[10px] text-muted font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <FiActivity size={12} className="text-warm hidden md:block"/>
              <span className="text-dark text-sm">{users.length}</span> Total
            </p>
            <div className="w-[1px] h-4 bg-soft hidden md:block"></div>
            <p className="text-[10px] text-warm font-bold tracking-[0.2em] uppercase">
              <span className="text-dark text-sm mr-1">{totalAdmins}</span> Admins
            </p>
            <div className="w-[1px] h-4 bg-soft hidden md:block"></div>
            <p className="text-[10px] text-muted font-bold tracking-[0.2em] uppercase">
              <span className="text-dark text-sm mr-1">{totalCustomers}</span> Customers
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 xl:min-w-[500px] w-full xl:w-auto">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-warm transition-colors" size={16}/>
            <input 
              type="text" placeholder="Search by name or email..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 md:py-3.5 text-xs md:text-sm bg-white border border-soft rounded-sm outline-none focus:border-warm w-full transition-all shadow-sm"
            />
          </div>
          <div className="relative group min-w-[140px] sm:min-w-[160px]">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={14}/>
            <select 
              value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-10 py-3 md:py-3.5 text-[10px] md:text-[11px] tracking-widest uppercase font-bold text-dark bg-white border border-soft rounded-sm outline-none focus:border-warm appearance-none cursor-pointer w-full shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="customer">Customers</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={14}/>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white md:bg-transparent md:border-0 border border-soft rounded-sm md:rounded-none shadow-sm md:shadow-none">
        
        {/* Desktop Header Row */}
        <div className="hidden md:flex items-center bg-gray-50/50 border border-soft rounded-t-sm shadow-sm relative z-0">
          <div className="px-6 py-5 text-[10px] tracking-[0.2em] uppercase font-bold text-muted w-[30%]">Profile</div>
          <div className="px-6 py-5 text-[10px] tracking-[0.2em] uppercase font-bold text-muted w-[25%]">Contact Details</div>
          <div className="px-6 py-5 text-[10px] tracking-[0.2em] uppercase font-bold text-muted w-[20%]">Access Level</div>
          <div className="px-6 py-5 text-[10px] tracking-[0.2em] uppercase font-bold text-muted w-[15%]">Joined On</div>
          <div className="px-6 py-5 text-[10px] tracking-[0.2em] uppercase font-bold text-muted w-[10%] text-center">Actions</div>
        </div>
        
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col md:gap-3 md:mt-3">
          <AnimatePresence mode="wait">
            {loading ? (
              // Loading State...
              [...Array(5)].map((_, i) => (
                <div key={`skel-${i}`} className="flex flex-col md:flex-row bg-white border-b md:border border-soft p-5 md:p-0 md:rounded-sm opacity-50"><div className="h-16 w-full animate-pulse bg-soft/30"/></div>
              ))
            ) : filteredUsers.length === 0 ? (
              // Empty State
              <div className="text-center py-20 bg-white md:border border-soft md:rounded-sm">
                <p className="text-lg font-display text-dark">No users found</p>
              </div>
            ) : (
              // 🌟 INTERACTIVE ROWS WITH 3D POP 🌟
              filteredUsers.map((user) => {
                const isMe = currentUser?._id === user._id;

                return (
                  <motion.div 
                    key={user._id} 
                    variants={cardVariants}
                    whileHover={{ 
                      scale: 1.015, 
                      y: -4, 
                      zIndex: 10,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    onClick={() => setSelectedUser(user)}
                    className={`relative cursor-pointer flex flex-col md:flex-row md:items-center bg-white border-b md:border border-soft p-5 md:p-0 md:rounded-sm transition-colors duration-200 ${isMe ? 'bg-warm/5' : ''}`}
                  >
                    
                    {/* Profile */}
                    <div className="flex items-center gap-4 md:w-[30%] md:px-6 md:py-5 mb-4 md:mb-0">
                      <div className={`w-12 h-12 rounded-sm flex items-center justify-center font-display text-lg border transition-colors flex-shrink-0 ${user.isAdmin ? 'bg-dark text-warm border-dark' : 'bg-gray-50 text-dark border-soft'}`}>
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-dark flex items-center gap-2 truncate">
                          {user.name} 
                          {isMe && <span className="text-[9px] bg-warm text-white px-2 py-0.5 rounded-sm tracking-[0.2em] uppercase font-bold flex-shrink-0">You</span>}
                        </p>
                        <p className="text-[10px] text-muted font-mono uppercase tracking-[0.15em] mt-1 opacity-70 truncate">ID: {String(user._id).slice(-8)}</p>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="flex flex-col md:flex-row md:items-center md:w-[25%] md:px-6 md:py-5 mb-4 md:mb-0">
                      <span className="md:hidden text-[9px] uppercase tracking-widest text-muted mb-1 font-bold">Contact</span>
                      <div className="flex items-center gap-2 text-sm text-dark font-medium truncate">
                        <FiMail size={12} className="text-muted/50 flex-shrink-0"/>
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                    
                    {/* Role Management */}
                    <div 
                      className="flex flex-col md:flex-row md:items-center md:w-[20%] md:px-6 md:py-5 mb-4 md:mb-0"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <span className="md:hidden text-[9px] uppercase tracking-widest text-muted mb-1 font-bold">Access Level</span>
                      {isMe ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-dark border border-dark rounded-sm w-fit cursor-default">
                          <FiShield size={12} className="text-warm"/>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-white">Super Admin</span>
                        </div>
                      ) : (
                        <div className="relative inline-block group/select w-full md:w-auto">
                          <select
                            value={user.isAdmin ? 'admin' : 'customer'}
                            onChange={(e) => handleRoleChange(user, e.target.value)}
                            disabled={updatingRole === user._id}
                            className={`appearance-none text-[10px] font-bold uppercase tracking-widest border rounded-sm pl-9 pr-8 py-2.5 outline-none w-full md:w-36 cursor-pointer transition-colors ${user.isAdmin ? 'bg-warm/10 text-warm border-warm' : 'bg-white text-muted border-soft hover:border-dark text-dark'}`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            {user.isAdmin ? <FiShield size={12} className="text-warm"/> : <FiUser size={12} className="text-muted"/>}
                          </div>
                          {updatingRole === user._id ? (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-[2px] border-warm border-t-transparent rounded-full animate-spin"/>
                          ) : (
                            <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-hover/select:text-dark"/>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Date & Actions */}
                    <div className="flex items-center justify-between md:w-[35%] md:px-0 pt-4 md:pt-0 border-t border-soft md:border-0">
                      <div className="flex flex-col md:flex-row md:items-center md:w-[60%] md:px-6 md:py-5">
                        <span className="md:hidden text-[9px] uppercase tracking-widest text-muted mb-1 font-bold">Joined On</span>
                        <div className="flex items-center gap-2">
                          <FiCalendar size={12} className="text-muted/50 hidden md:block"/>
                          <span className="text-xs md:text-sm font-medium text-muted">{new Date(user.createdAt).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end md:justify-center md:w-[40%] md:px-6 md:py-5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(user._id, user.name); }} 
                          disabled={deleting === user._id || isMe} 
                          title={isMe ? "You cannot delete yourself" : "Delete User"}
                          className="flex items-center justify-center w-9 h-9 md:w-8 md:h-8 rounded-sm text-red-400 border border-transparent hover:border-red-200 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent bg-gray-50 md:bg-transparent transition-all z-10"
                        >
                          {deleting === user._id ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"/> : <FiTrash2 size={16} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 🌟 USER DETAILS SLIDE-OVER WINDOW (DRAWER) 🌟 */}
      <AnimatePresence>
        {selectedUser && (
          <>
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-40 cursor-pointer"
            />
            
            {/* Drawer Panel */}
            <motion.div 
              variants={drawerVariants} initial="hidden" animate="show" exit="exit"
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto flex flex-col border-l border-soft"
            >
              {/* Drawer Header */}
              <div className="bg-gray-50 p-6 md:p-8 border-b border-soft sticky top-0 z-10 flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className={`w-14 h-14 rounded-sm flex items-center justify-center font-display text-2xl border ${selectedUser.isAdmin ? 'bg-dark text-warm border-dark' : 'bg-white text-dark border-soft'}`}>
                    {selectedUser.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-dark leading-none mb-1">{selectedUser.name}</h2>
                    <span className={`inline-block text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm ${selectedUser.isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-soft text-muted'}`}>
                      {selectedUser.isAdmin ? 'Admin Account' : 'Customer'}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 bg-white border border-soft rounded-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                  <FiX size={18}/>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 md:p-8 space-y-8 flex-1">
                
                {/* Personal Info Box */}
                <div>
                  <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-muted mb-4 flex items-center gap-2"><FiUser className="text-warm"/> Personal Info</h3>
                  <div className="space-y-3 bg-white border border-soft rounded-sm p-4 shadow-sm">
                    {/* Email */}
                    <div className="flex items-center justify-between group">
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Email Address</p>
                        <p className="text-sm font-medium text-dark truncate">{selectedUser.email}</p>
                      </div>
                      <button onClick={() => copyToClipboard(selectedUser.email, 'Email')} className="p-2 text-muted hover:text-dark hover:bg-gray-50 rounded-sm opacity-0 group-hover:opacity-100 transition-all"><FiCopy size={14}/></button>
                    </div>
                    
                    {/* Phone - 💡 SMART FALLBACK LOGIC ADDED HERE */}
                    {(() => {
                      // Profile का नंबर चेक करेगा, वरना Addresses में से ढूंढेगा
                      const displayPhone = selectedUser.phone || 
                                           selectedUser.addresses?.find(a => a.isDefault)?.phone || 
                                           selectedUser.addresses?.[0]?.phone || 
                                           'Not provided';
                      return (
                        <div className="flex items-center justify-between group pt-3 border-t border-soft">
                          <div>
                            <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Phone Number</p>
                            <p className="text-sm font-medium text-dark">{displayPhone}</p>
                          </div>
                          {displayPhone !== 'Not provided' && (
                            <button onClick={() => copyToClipboard(displayPhone, 'Phone Number')} className="p-2 text-muted hover:text-dark hover:bg-gray-50 rounded-sm opacity-0 group-hover:opacity-100 transition-all">
                              <FiCopy size={14}/>
                            </button>
                          )}
                        </div>
                      );
                    })()}

                    {/* User ID */}
                    <div className="flex items-center justify-between group pt-3 border-t border-soft">
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Account ID</p>
                        <p className="text-xs font-mono text-dark bg-gray-50 px-2 py-0.5 rounded-sm border border-soft">{selectedUser._id}</p>
                      </div>
                      <button onClick={() => copyToClipboard(selectedUser._id, 'User ID')} className="p-2 text-muted hover:text-dark hover:bg-gray-50 rounded-sm opacity-0 group-hover:opacity-100 transition-all"><FiCopy size={14}/></button>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-muted mb-4 flex items-center gap-2"><FiMapPin className="text-warm"/> Saved Addresses</h3>
                  {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                    <div className="space-y-3">
                      {selectedUser.addresses.map((addr, idx) => (
                        <div key={idx} className="bg-gray-50 border border-soft rounded-sm p-4 relative group">
                           {addr.isDefault && <span className="absolute top-4 right-4 text-[9px] bg-dark text-white px-2 py-0.5 rounded-sm uppercase tracking-widest">Default</span>}
                           <p className="font-bold text-sm text-dark mb-1">{addr.fullName}</p>
                           
                           {/* 💡 Address ke andar bhi Phone Number dikhaya gaya hai */}
                           <p className="text-xs text-muted leading-relaxed mb-1">
                             {addr.street}, {addr.city}<br/>
                             {addr.state}, {addr.country} - <span className="font-medium text-dark">{addr.pincode}</span>
                           </p>
                           <p className="text-[11px] font-medium text-dark flex items-center gap-1.5 opacity-80">
                              <FiPhone size={10} className="text-warm"/> {addr.phone}
                           </p>
                           
                           <button onClick={() => copyToClipboard(`${addr.fullName}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}. Phone: ${addr.phone}`, 'Address')} 
                             className="absolute bottom-4 right-4 flex items-center gap-1 text-[10px] uppercase font-bold text-muted hover:text-dark transition-colors opacity-0 group-hover:opacity-100">
                             <FiCopy/> Copy
                           </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-soft rounded-sm p-6 text-center bg-gray-50/50">
                      <p className="text-sm text-muted">No addresses saved yet.</p>
                    </div>
                  )}
                </div>

                {/* Orders Shortcut */}
                <div>
                  <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-muted mb-4 flex items-center gap-2"><FiShoppingBag className="text-warm"/> Order Activity</h3>
                  <div className="bg-dark text-white p-5 rounded-sm flex items-center justify-between group cursor-pointer hover:bg-black transition-colors"
                       onClick={() => navigate(`/admin/orders?user=${selectedUser._id}`)}>
                    <div>
                      <p className="font-display text-lg mb-1">View Order History</p>
                      <p className="text-xs text-white/60 tracking-wide">Check current and past orders</p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiShoppingBag size={18}/>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}