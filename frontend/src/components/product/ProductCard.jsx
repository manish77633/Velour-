import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { formatPrice, calcDiscount } from '../../utils/formatPrice';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
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
    e.preventDefault(); // Prevents redirecting to detail page
    e.stopPropagation(); // Stops event bubbling
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="relative overflow-hidden rounded-sm bg-soft mb-3">
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider uppercase">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-dark text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider uppercase">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-20 
            ${isWishlisted 
              ? 'bg-white opacity-100 text-red-500' 
              : 'bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 text-dark hover:bg-white'
            }`}
        >
          <FiHeart size={14} className={isWishlisted ? 'fill-red-500' : ''} />
        </button>

        {/* Quick Add */}
        <button onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-dark text-white text-xs tracking-widest uppercase
                     py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0
                     transition-transform duration-300 font-medium z-20">
          <FiShoppingBag size={14} /> Quick Add
        </button>
      </div>

      {/* Info */}
      <div>
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-0.5">{product.category}</p>
        <h3 className="text-sm font-medium text-dark leading-snug mb-1 line-clamp-1">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar key={s} size={10}
                className={s <= Math.round(product.averageRating || 0) ? 'fill-accent text-accent' : 'text-soft'} />
            ))}
          </div>
          <span className="text-[10px] text-muted">({product.numReviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-dark">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-muted line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;