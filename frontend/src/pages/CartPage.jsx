import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQty, clearCart } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { items, totalPrice, totalQty } = useSelector((s) => s.cart);
  const [promo, setPromo] = useState('');

  const shippingCharge = totalPrice >= 999 ? 0 : 99;
  const total          = totalPrice + shippingCharge;

  const applyPromo = () => toast.error('Invalid promo code');

  if (!items.length) return (
    <main className="pt-16 min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center py-20 px-4">
        <FiShoppingBag size={56} className="text-muted/25 mx-auto mb-5"/>
        <h2 className="font-display text-3xl mb-2">Your bag is empty</h2>
        <p className="text-sm text-muted mb-7">Looks like you haven't added anything yet!</p>
        <Link to="/shop" className="btn-primary inline-flex">Start Shopping <FiArrowRight size={14}/></Link>
      </div>
    </main>
  );

  return (
    <main className="pt-16 min-h-screen bg-cream">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl mb-1">Shopping Bag</h1>
        <p className="text-sm text-muted mb-8">{totalQty} {totalQty === 1 ? 'item' : 'items'}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── CART ITEMS ── */}
          <div className="lg:col-span-2 space-y-px bg-soft/50 rounded-sm overflow-hidden">
            {items.map((item) => (
              <div key={item.key} className="bg-white grid grid-cols-[100px_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 p-4 md:p-5">
                {/* Image */}
                <Link to={`/product/${item.productId}`}
                  className="aspect-[3/4] bg-soft rounded-sm overflow-hidden block">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center text-muted/30"><FiShoppingBag size={24}/></div>}
                </Link>

                {/* Details */}
                <div className="py-1">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-0.5">{item.category}</p>
                  <Link to={`/product/${item.productId}`}
                    className="font-medium text-sm leading-snug hover:text-warm transition-colors block mb-1">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted mb-3">
                    Size: <span className="text-dark">{item.size}</span>
                    {item.color && <> · Color: <span className="text-dark">{item.color}</span></>}
                  </p>
                  <p className="text-sm font-semibold">{formatPrice(item.price)}</p>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-soft rounded-sm overflow-hidden">
                      <button onClick={() => dispatch(updateQty({ key: item.key, qty: item.qty - 1 }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-soft transition-colors">
                        <FiMinus size={12}/>
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                      <button onClick={() => dispatch(updateQty({ key: item.key, qty: item.qty + 1 }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-soft transition-colors">
                        <FiPlus size={12}/>
                      </button>
                    </div>
                    <button onClick={() => { dispatch(removeFromCart(item.key)); toast.success('Item removed'); }}
                      className="text-muted hover:text-red-500 transition-colors text-xs flex items-center gap-1">
                      <FiTrash2 size={13}/> Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right py-1">
                  <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="bg-white px-5 py-3 flex justify-between items-center">
              <Link to="/shop" className="text-xs text-muted hover:text-dark transition-colors underline">
                ← Continue Shopping
              </Link>
              <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }}
                className="text-xs text-muted hover:text-red-500 transition-colors">
                Clear All
              </button>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="h-fit sticky top-24">
            <div className="bg-white rounded-sm p-6">
              <h2 className="font-display text-xl mb-5 pb-4 border-b border-soft">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal ({totalQty} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className={shippingCharge === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {shippingCharge === 0 ? 'Free' : formatPrice(shippingCharge)}
                  </span>
                </div>
                {shippingCharge > 0 && (
                  <p className="text-xs text-warm bg-warm/8 px-3 py-2 rounded-sm">
                    Add {formatPrice(999 - totalPrice)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-soft pt-4 mb-5">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted mt-1">Inclusive of all taxes</p>
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-5">
                <input type="text" value={promo} onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter promo code"
                  className="input-field flex-1 py-2 text-xs"/>
                <button onClick={applyPromo} className="btn-outline py-2 px-3 text-xs">Apply</button>
              </div>

              <button onClick={() => navigate('/checkout')}
                className="btn-primary w-full justify-center py-4 text-sm">
                Proceed to Checkout <FiArrowRight size={14}/>
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted">
                <FiLock size={12}/> Secured by Razorpay · 256-bit SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
