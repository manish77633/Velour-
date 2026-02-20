import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeCart, removeFromCart, updateQty } from '../../redux/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';
import { FiX, FiShoppingBag, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const CartDrawer = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, totalPrice, totalQty, isOpen } = useSelector((s) => s.cart);

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={() => dispatch(closeCart())}
        className={`fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}/>

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-cream z-50 flex flex-col
        shadow-2xl transition-transform duration-350 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-soft">
          <div className="flex items-center gap-2">
            <FiShoppingBag size={18}/>
            <h2 className="font-display text-lg">Shopping Bag</h2>
            {totalQty > 0 && (
              <span className="bg-warm text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalQty}
              </span>
            )}
          </div>
          <button onClick={() => dispatch(closeCart())}
            className="w-9 h-9 rounded-full hover:bg-soft flex items-center justify-center transition-colors">
            <FiX size={20}/>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <FiShoppingBag size={48} className="text-muted/30"/>
              <div>
                <p className="font-display text-xl text-dark">Your bag is empty</p>
                <p className="text-sm text-muted mt-1">Add items to get started</p>
              </div>
              <button onClick={() => { dispatch(closeCart()); navigate('/shop'); }}
                className="btn-primary mt-2">
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 pb-4 border-b border-soft last:border-0">
                  {/* Image */}
                  <div className="w-20 h-24 bg-soft rounded-sm flex-shrink-0 overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-muted/30">
                          <FiShoppingBag size={24}/>
                        </div>}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted tracking-wider uppercase mb-0.5">{item.category}</p>
                    <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                    <p className="text-xs text-muted mt-0.5">Size: {item.size}{item.color ? ` · ${item.color}` : ''}</p>
                    <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                    {/* Qty Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-soft rounded-sm overflow-hidden">
                        <button onClick={() => dispatch(updateQty({ key: item.key, qty: item.qty - 1 }))}
                          className="w-7 h-7 flex items-center justify-center hover:bg-soft transition-colors">
                          <FiMinus size={12}/>
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => dispatch(updateQty({ key: item.key, qty: item.qty + 1 }))}
                          className="w-7 h-7 flex items-center justify-center hover:bg-soft transition-colors">
                          <FiPlus size={12}/>
                        </button>
                      </div>
                      <button onClick={() => dispatch(removeFromCart(item.key))}
                        className="text-muted hover:text-red-500 transition-colors p-1">
                        <FiTrash2 size={14}/>
                      </button>
                    </div>
                  </div>
                  {/* Item Total */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-soft px-5 py-5 bg-cream">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="text-base font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            {totalPrice < 999 && (
              <p className="text-xs text-warm mb-3">
                Add {formatPrice(999 - totalPrice)} more for free shipping!
              </p>
            )}
            <button onClick={handleCheckout} className="btn-primary w-full justify-center py-3.5 text-sm">
              Proceed to Checkout
            </button>
            <button onClick={() => { dispatch(closeCart()); navigate('/cart'); }}
              className="w-full text-center text-xs text-muted hover:text-dark transition-colors mt-3">
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
