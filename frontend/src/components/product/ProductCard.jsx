import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { formatPrice, calcDiscount } from '../../utils/formatPrice';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

// 💡 NEW: Accept 'isDark' prop to handle dark background visibility
const ProductCard = ({ product, isDark = false }) => {
  const dispatch = useDispatch();

  // Redux Wishlist State
  const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });
  const isWishlisted = wishlistItems?.some((item) => item._id === product._id);

  const discount = calcDiscount(product.price, product.originalPrice);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      product,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || '',
      qty: 1,
    }));
    toast.success(`${product.name} added to bag!`);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist ❤️");
    }
  };

  // 🎨 Dynamic Colors based on Background
  const textColor = isDark ? 'text-[#FAF7F2]' : 'text-[#1C1917]'; // Off-white vs Black
  const subTextColor = isDark ? 'text-[#A3968A]' : 'text-[#6A5848]'; // Muted Gold vs Brown-Gray
  const cardBg = isDark ? 'bg-[#2A2725]' : 'bg-[#F5F5F5]'; // Slightly lighter dark vs soft gray

  return (
    <Link to={`/product/${product._id}`} className="group block relative">
      {/* Image Container */}
      <div className={`relative overflow-hidden rounded-sm mb-5 ${cardBg} transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]`}>
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        </div>

        {/* Premium Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {discount > 0 && (
            <span className="bg-[#AA3333] text-white text-[9px] font-bold px-3 py-1 tracking-[0.1em] uppercase rounded-full shadow-lg">
              {discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#C4A882] text-[#1C1917] text-[9px] font-bold px-3 py-1 tracking-[0.1em] uppercase rounded-full shadow-lg">
              New Season
            </span>
          )}
        </div>

        {/* Refined Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 z-30 
            ${isWishlisted
              ? 'bg-white text-[#AA3333] shadow-lg scale-110'
              : 'bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 text-white hover:bg-white hover:text-[#1C1917] border border-white/20'
            }`}
        >
          <FiHeart size={16} className={isWishlisted ? 'fill-[#AA3333]' : ''} />
        </button>

        {/* Seamless Quick Add (Animated from bottom) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
          <button onClick={handleQuickAdd}
            className="bg-[#FAF7F2] text-[#1C1917] px-8 py-3 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold
                       flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#C4A882] active:scale-95 shadow-2xl">
            <FiShoppingBag size={14} /> Add to Bag
          </button>
        </div>
      </div>

      {/* Info Section with Refined Spacing & Transitions */}
      <div className="space-y-2 text-center group-hover:-translate-y-1 transition-transform duration-500">
        <p className={`text-[9px] tracking-[0.4em] uppercase font-bold mb-1 opacity-60 ${subTextColor}`}>
          {product.category}
        </p>

        <h3 className={`text-base font-light tracking-wide leading-tight px-2 transition-colors duration-300 group-hover:text-[#C4A882] ${textColor}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {product.name}
        </h3>

        {/* Rating & Price Unified */}
        <div className="flex flex-col items-center gap-2 mt-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar key={s} size={10}
                className={s <= Math.round(product.averageRating || 0)
                  ? 'fill-[#C4A882] text-[#C4A882]'
                  : isDark ? 'text-white/10' : 'text-gray-200'}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-base font-medium tracking-tight ${textColor}`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={`text-xs line-through opacity-40 ${isDark ? 'text-white' : 'text-gray-400'}`}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;