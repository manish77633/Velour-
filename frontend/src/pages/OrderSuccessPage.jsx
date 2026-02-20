import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheck, FiPackage, FiTruck, FiSmile } from 'react-icons/fi';
import api from '../services/api';
import { formatPrice } from '../utils/formatPrice';

export default function OrderSuccessPage() {
  const { id }  = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {});
  }, [id]);

  return (
    <main className="pt-16 min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-sm p-8 md:p-12 max-w-lg w-full shadow-lg text-center">

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
          <FiCheck size={30} className="text-white" strokeWidth={2.5}/>
        </div>

        <h1 className="font-display text-3xl md:text-4xl mb-2">Order Confirmed!</h1>
        <p className="text-sm text-muted mb-3">
          Thank you for shopping with VELOUR. Your payment has been verified.
        </p>

        {order && (
          <div className="inline-block bg-soft px-5 py-2 rounded-sm text-sm font-semibold tracking-wider text-dark mb-5">
            Order #{String(order._id).slice(-8).toUpperCase()}
          </div>
        )}

        <p className="text-xs text-muted mb-7">
          A confirmation email has been sent to your registered email address.
        </p>

        {/* Steps */}
        <div className="flex justify-center gap-6 bg-soft rounded-sm p-5 mb-7">
          {[
            { icon: FiCheck,   label: 'Confirmed', active: true },
            { icon: FiPackage, label: 'Processing', active: false },
            { icon: FiTruck,   label: 'Shipped', active: false },
            { icon: FiSmile,   label: 'Delivered', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} className={`flex flex-col items-center gap-1 ${active ? '' : 'opacity-30'}`}>
              <Icon size={20} className={active ? 'text-green-500' : 'text-muted'}/>
              <span className="text-[10px] tracking-wider uppercase text-muted">{label}</span>
            </div>
          ))}
        </div>

        {order && (
          <div className="text-sm mb-7">
            <p className="font-medium mb-2">Delivering to:</p>
            <p className="text-muted text-xs leading-relaxed">
              {order.shippingAddress?.fullName}<br/>
              {order.shippingAddress?.street}, {order.shippingAddress?.city}<br/>
              {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
            <div className="mt-3 pt-3 border-t border-soft flex justify-between">
              <span className="text-muted text-xs">Amount Paid</span>
              <span className="font-semibold text-sm">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link to="/profile?tab=orders" className="btn-primary w-full justify-center py-3">Track My Order</Link>
          <Link to="/shop" className="btn-outline w-full justify-center py-3">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
