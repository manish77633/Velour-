// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign,
  FiTrendingUp, FiPlus, FiArrowRight, FiActivity, FiClock
} from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/orders?limit=10'),
      api.get('/products?limit=1'), 
      api.get('/users'),
    ]).then(([ordersRes, productsRes, usersRes]) => {
      const allOrders = ordersRes.data.orders || [];
      setOrders(allOrders.slice(0, 5)); 
      
      const revenue = allOrders.reduce((acc, order) => 
        order.isPaid ? acc + order.totalPrice : acc, 0
      );
      
      setStats({
        totalOrders: ordersRes.data.total || allOrders.length,
        totalProducts: productsRes.data.total || 0,
        totalUsers: usersRes.data.users?.length || 0,
        totalRevenue: revenue,
      });
    }).catch((err) => {
      console.error("Dashboard Error:", err);
    }).finally(() => setLoading(false));
  }, []);

  // Dummy Chart Data
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const STAT_CARDS = [
    { 
      label: 'Total Revenue', 
      value: formatPrice(stats.totalRevenue), 
      icon: FiDollarSign, 
      link: '/admin/orders',
      color: 'text-[#C4A882]', 
      bg: 'bg-[#1C1917]', 
      sub: 'Net Earnings'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: FiShoppingBag, 
      link: '/admin/orders',
      color: 'text-emerald-600', 
      bg: 'bg-white',
      sub: 'All time orders'
    },
    { 
      label: 'Products', 
      value: stats.totalProducts, 
      icon: FiPackage, 
      link: '/admin/products',
      color: 'text-blue-600', 
      bg: 'bg-white',
      sub: 'Active Inventory'
    },
    { 
      label: 'Customers', 
      value: stats.totalUsers, 
      icon: FiUsers, 
      link: '/admin/users',
      color: 'text-purple-600', 
      bg: 'bg-white',
      sub: 'Registered Users'
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-2 border-[#C4A882] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-8 px-2 md:px-0" // Add padding on mobile
    >
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-[#1C1917]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 font-light tracking-wide">
            Overview of your store's performance.
          </p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="group relative overflow-hidden bg-[#1C1917] text-white w-full md:w-auto px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="absolute inset-0 w-full h-full bg-[#C4A882] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
          <span className="relative flex items-center gap-2">
            <FiPlus size={16}/> Add Product
          </span>
        </Link>
      </div>

      {/* ── STAT CARDS ── */}
      {/* Grid changed to 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            onClick={() => navigate(card.link)}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            className={`${card.bg} p-6 rounded-sm border border-[#E5E5E5] shadow-sm cursor-pointer relative overflow-hidden group transition-colors`}
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-1 
                  ${card.label === 'Total Revenue' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {card.label}
                </p>
                <h3 className={`text-2xl md:text-3xl font-display ${card.label === 'Total Revenue' ? 'text-white' : 'text-[#1C1917]'}`}>
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${card.label === 'Total Revenue' ? 'bg-white/10 text-[#C4A882]' : 'bg-gray-50 ' + card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            
            <div className={`flex items-center gap-2 text-[10px] uppercase tracking-wider font-medium opacity-60 relative z-10
              ${card.label === 'Total Revenue' ? 'text-gray-300' : 'text-gray-400'}`}>
              <FiTrendingUp /> {card.sub}
            </div>

            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-current opacity-5 rounded-full z-0 group-hover:scale-150 transition-transform duration-700 text-[#C4A882]" />
          </motion.div>
        ))}
      </div>

      {/* ── CHARTS & LINKS ── */}
      {/* Stacked on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Sales Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 md:p-8 rounded-sm border border-[#E5E5E5] shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-display text-lg md:text-xl text-[#1C1917] flex items-center gap-2">
               <FiActivity className="text-[#C4A882]" /> Revenue Analytics
             </h3>
          </div>
          {/* Chart Height optimized for mobile */}
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4A882" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C4A882" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF', textTransform: 'uppercase' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  cursor={{ stroke: '#C4A882', strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: '#1C1917', border: 'none', borderRadius: '0px', color: '#fff' }}
                  itemStyle={{ color: '#C4A882', fontSize: '12px', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#1C1917" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-sm border border-[#E5E5E5] shadow-sm flex flex-col">
          <h3 className="font-display text-lg md:text-xl mb-6 text-[#1C1917]">Quick Actions</h3>
          <div className="space-y-3 flex-1">
            {[
              { label: 'Manage Inventory', to: '/admin/products', icon: FiPackage },
              { label: 'Process Orders', to: '/admin/orders', icon: FiShoppingBag },
              { label: 'Customer Database', to: '/admin/users', icon: FiUsers },
            ].map((item, i) => (
              <Link 
                key={i} 
                to={item.to} 
                className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-sm hover:border-[#C4A882] hover:bg-[#FAF7F2] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-gray-400 group-hover:text-[#C4A882] group-hover:border-[#C4A882] transition-colors">
                    <item.icon size={14} />
                  </div>
                  <span className="text-sm font-medium text-[#1C1917]">{item.label}</span>
                </div>
                <FiArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 group-hover:text-[#C4A882] transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── RECENT ORDERS ── */}
      <motion.div variants={itemVariants} className="bg-white rounded-sm border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E5E5E5] flex justify-between items-center bg-[#FAF7F2]/50">
          <h3 className="font-display text-lg md:text-xl text-[#1C1917] flex items-center gap-2">
            <FiClock className="text-gray-400"/> Recent Orders
          </h3>
          <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-[#C4A882] hover:text-[#1C1917] transition-colors flex items-center gap-1 group">
            View All <FiArrowRight className="transition-transform group-hover:translate-x-1"/>
          </Link>
        </div>
        
        {/* Horizontal Scroll for Table on Mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-[#E5E5E5]">
              <tr>
                {['Order ID', 'Customer', 'Status', 'Date', 'Amount', 'Action'].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {orders.map((order) => (
                <motion.tr 
                  key={order._id} 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.01, backgroundColor: "#FAF7F2", zIndex: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white cursor-pointer relative"
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                >
                  <td className="px-6 py-4 font-mono text-xs font-medium text-[#1C1917]">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#C4A882] flex items-center justify-center text-xs font-bold">
                        {order.user?.name?.[0] || 'G'}
                      </div>
                      <span className="font-medium text-[#1C1917]">{order.user?.name || 'Guest'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wide">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-display font-medium text-[#1C1917]">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-[#C4A882] hover:underline">
                      Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}