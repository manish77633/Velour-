// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign,
  FiTrendingUp, FiPlusCircle, FiEdit, FiAlertCircle,
} from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders?limit=5'),
      api.get('/products?limit=1'),
      api.get('/users'),
    ]).then(([ordersRes, productsRes, usersRes]) => {
      const allOrders = ordersRes.data.orders || [];
      setOrders(allOrders.slice(0, 5));
      setStats({
        totalOrders:   ordersRes.data.total   || 0,
        totalProducts: productsRes.data.total || 0,
        totalUsers:    usersRes.data.users?.length || 0,
        totalRevenue:  allOrders.reduce((s, o) => s + (o.isPaid ? o.totalPrice : 0), 0),
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Revenue',  value: formatPrice(stats.totalRevenue),  icon: FiDollarSign, color: 'bg-green-50 text-green-600'  },
    { label: 'Total Orders',   value: stats.totalOrders,                icon: FiShoppingBag,color: 'bg-blue-50 text-blue-600'    },
    { label: 'Total Products', value: stats.totalProducts,              icon: FiPackage,    color: 'bg-warm/10 text-warm'         },
    { label: 'Total Users',    value: stats.totalUsers,                 icon: FiUsers,      color: 'bg-purple-50 text-purple-600' },
  ] : [];

  const STATUS_COLOR = {
    processing: 'bg-yellow-100 text-yellow-700',
    shipped:    'bg-blue-100 text-blue-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-normal">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Welcome back, Manish 👋</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary inline-flex gap-2 items-center">
          <FiPlusCircle size={16}/> Add Product
        </Link>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-sm p-5 animate-pulse h-28"/>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-sm p-5 border border-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs tracking-[0.15em] uppercase text-muted font-medium">{label}</span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
                  <Icon size={16}/>
                </div>
              </div>
              <p className="font-display text-2xl font-normal">{value}</p>
              <p className="text-xs text-muted mt-1 flex items-center gap-1">
                <FiTrendingUp size={11}/> vs last month
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-sm border border-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-warm hover:underline">View all →</Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <FiShoppingBag size={32} className="mx-auto mb-2 opacity-25"/>
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="flex items-center gap-3 py-2 border-b border-soft last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">#{String(order._id).slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted truncate">{order.user?.name || 'Guest'} · {order.orderItems?.length} items</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${STATUS_COLOR[order.deliveryStatus] || 'bg-soft text-muted'}`}>
                    {order.deliveryStatus}
                  </span>
                  <span className="text-sm font-semibold">{formatPrice(order.totalPrice)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-sm border border-soft p-6">
          <h2 className="font-display text-xl mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Add New Product',    to: '/admin/products/new',  icon: FiPlusCircle, primary: true  },
              { label: 'Manage Products',    to: '/admin/products',       icon: FiPackage  },
              { label: 'View All Orders',    to: '/admin/orders',         icon: FiShoppingBag },
              { label: 'Manage Users',       to: '/admin/users',          icon: FiUsers },
            ].map(({ label, to, icon: Icon, primary }) => (
              <Link key={label} to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-all
                  ${primary ? 'bg-dark text-white' : 'border border-soft hover:border-warm hover:text-warm'}`}>
                <Icon size={15}/> {label}
              </Link>
            ))}
          </div>

          <div className="mt-5 p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
            <p className="flex items-center gap-2 text-xs text-yellow-700 font-medium mb-1">
              <FiAlertCircle size={13}/> Tip
            </p>
            <p className="text-xs text-yellow-600">
              First time? Run <code className="bg-yellow-100 px-1 rounded">node seeder.js</code> in backend folder to add 12 sample products!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
