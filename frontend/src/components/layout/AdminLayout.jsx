// frontend/src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiMenu, FiX, FiLogOut, FiExternalLink,
} from 'react-icons/fi';

const NAV = [
  { label: 'Dashboard', to: '/admin',           icon: FiGrid       },
  { label: 'Products',  to: '/admin/products',   icon: FiPackage    },
  { label: 'Orders',    to: '/admin/orders',     icon: FiShoppingBag},
  { label: 'Users',     to: '/admin/users',      icon: FiUsers      },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="font-display text-2xl mb-2">Access Denied</p>
          <p className="text-muted text-sm mb-5">Admin access required.</p>
          <Link to="/" className="btn-primary py-2 px-5 text-xs">Go to Store</Link>
        </div>
      </div>
    );
  }

  const isActive = (to) =>
    to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-[#F5F3F0] flex">

      {/* ── SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-dark flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>

        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link to="/admin" className="font-display text-xl font-semibold tracking-[0.14em] text-cream block">
            VEL<span className="text-accent">OUR</span>
            <span className="text-xs text-muted tracking-wider font-sans ml-2">Admin</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {NAV.map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm transition-all duration-150
                ${isActive(to)
                  ? 'bg-warm text-white font-medium'
                  : 'text-cream/60 hover:text-cream hover:bg-white/8'}`}>
              <Icon size={16}/> {label}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link to="/" target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/50 hover:text-cream hover:bg-white/8 rounded-sm transition-all">
            <FiExternalLink size={15}/> View Store
          </Link>
          <button onClick={() => { dispatch(logout()); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cream/50 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-all text-left">
            <FiLogOut size={15}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-dark/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top Bar */}
        <header className="bg-white border-b border-soft px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-sm hover:bg-soft transition-colors">
            {sidebarOpen ? <FiX size={18}/> : <FiMenu size={18}/>}
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <Link to="/admin/products/new"
              className="hidden md:inline-flex btn-primary py-2 px-4 text-xs gap-1.5 items-center">
              + Add Product
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium leading-none">{user?.name}</p>
                <p className="text-[10px] text-muted mt-0.5">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
