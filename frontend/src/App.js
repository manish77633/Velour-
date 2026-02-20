import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from './redux/slices/authSlice';
import { loadCartFromStorage } from './redux/slices/cartSlice';

import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import CartDrawer  from './components/cart/CartDrawer';
import AdminLayout from './components/layout/AdminLayout';

import HomePage          from './pages/HomePage';
import ShopPage          from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import OrderSuccessPage  from './pages/OrderSuccessPage';
import LoginPage         from './pages/LoginPage';
import ProfilePage       from './pages/ProfilePage';
import AuthSuccessPage   from './pages/AuthSuccessPage';
import ProtectedRoute    from './components/auth/ProtectedRoute';

import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminProducts    from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders      from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserFromStorage());
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* ── ADMIN (no Navbar/Footer) ── */}
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index                    element={<AdminDashboard/>}/>
          <Route path="products"          element={<AdminProducts/>}/>
          <Route path="products/new"      element={<AdminProductForm/>}/>
          <Route path="products/:id/edit" element={<AdminProductForm/>}/>
          <Route path="orders"            element={<AdminOrders/>}/>
          <Route path="orders/:id"         element={<AdminOrderDetail/>}/>
          <Route path="users" element={
            <div className="bg-white rounded-sm border border-soft p-8 text-center">
              <p className="font-display text-2xl mb-2">Users Management</p>
              <p className="text-muted text-sm">Coming soon.</p>
            </div>
          }/>
        </Route>

        {/* ── PUBLIC (with Navbar/Footer) ── */}
        <Route path="*" element={
          <>
            <Navbar/>
            <CartDrawer/>
            <Routes>
              <Route path="/"              element={<HomePage/>}/>
              <Route path="/shop"          element={<ShopPage/>}/>
              <Route path="/product/:id"   element={<ProductDetailPage/>}/>
              <Route path="/cart"          element={<CartPage/>}/>
              <Route path="/login"         element={<LoginPage/>}/>
              <Route path="/auth/success"  element={<AuthSuccessPage/>}/>
              <Route element={<ProtectedRoute/>}>
                <Route path="/checkout"          element={<CheckoutPage/>}/>
                <Route path="/order-success/:id" element={<OrderSuccessPage/>}/>
                <Route path="/profile"           element={<ProfilePage/>}/>
              </Route>
            </Routes>
            <Footer/>
          </>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
