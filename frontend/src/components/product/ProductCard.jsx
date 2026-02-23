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
    <Link to={`/product/${product._id}`} className="group block">
      {/* Image Container */}
      <div className={`relative overflow-hidden rounded-sm mb-3 ${cardBg}`}>
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-[#AA3333] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#1C1917] text-[#C4A882] text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-20 
            ${isWishlisted 
              ? 'bg-white opacity-100 text-[#AA3333]' 
              : 'bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 text-dark hover:bg-white hover:scale-110'
            }`}
        >
          <FiHeart size={14} className={isWishlisted ? 'fill-[#AA3333]' : ''} />
        </button>

        {/* Quick Add (Always visible on hover, consistent style) */}
        <button onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-[#1C1917] text-[#C4A882] text-[10px] tracking-[0.2em] uppercase font-bold
                     py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0
                     transition-transform duration-300 z-20">
          <FiShoppingBag size={14} /> Quick Add
        </button>
      </div>

      {/* Info Section with Dynamic Colors */}
      <div className="space-y-1">
        <p className={`text-[10px] tracking-[0.2em] uppercase font-bold ${subTextColor}`}>
          {product.category}
        </p>
        
        <h3 className={`text-sm font-medium leading-snug line-clamp-1 ${textColor}`}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar key={s} size={11}
                className={s <= Math.round(product.averageRating || 0) 
                  ? 'fill-[#C4A882] text-[#C4A882]' // Gold stars
                  : isDark ? 'text-white/20' : 'text-gray-300'} // Empty stars change based on bg
              />
            ))}
          </div>
          <span className={`text-[10px] ${subTextColor}`}>({product.numReviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-sm font-semibold tracking-wide ${textColor}`}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={`text-xs line-through ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;