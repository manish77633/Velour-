import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { formatPrice, calcDiscount } from '../utils/formatPrice';
import ReviewForm from '../components/product/ReviewForm';
import { Loader } from '../components/common/Loader';
import {
  FiShoppingBag, FiHeart, FiShare2, FiStar,
  FiTruck, FiRefreshCw, FiShield, FiAward,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const { product, loading } = useSelector((s) => s.product);

  const [activeImg,  setActiveImg]  = useState(0);
  const [selSize,    setSelSize]    = useState('');
  const [selColor,   setSelColor]   = useState('');
  const [qty,        setQty]        = useState(1);
  const [activeTab,  setActiveTab]  = useState('description');
  const [wishlist,   setWishlist]   = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setSelSize(product.sizes?.[0] || '');
      setSelColor(product.colors?.[0] || '');
      setActiveImg(0);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selSize) return toast.error('Please select a size');
    dispatch(addToCart({ product, size: selSize, color: selColor, qty }));
    toast.success(`${product.name} added to bag!`);
  };

  if (loading) return <div className="pt-16 min-h-screen flex items-center justify-center"><Loader size="lg"/></div>;
  if (!product) return <div className="pt-16 min-h-screen flex items-center justify-center"><p className="text-muted">Product not found.</p></div>;

  const discount  = calcDiscount(product.price, product.originalPrice);
  const images    = product.images?.length ? product.images : ['/placeholder.jpg'];

  return (
    <main className="pt-16 bg-cream min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-6">
          <Link to="/" className="hover:text-dark transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-dark transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-dark transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-dark truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── GALLERY ── */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-soft rounded-sm overflow-hidden mb-3">
              <img src={images[activeImg]} alt={product.name}
                className="w-full h-full object-cover"/>
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all
                      ${activeImg === i ? 'border-warm' : 'border-transparent'}`}>
                    <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div>
            <p className="section-label mb-2">{product.category}'s Collection</p>
            <h1 className="font-display text-3xl md:text-4xl font-normal leading-tight mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-soft">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <FiStar key={s} size={15}
                    className={s <= Math.round(product.averageRating) ? 'fill-accent text-accent' : 'text-soft'}/>
                ))}
              </div>
              <span className="text-sm font-semibold">{product.averageRating}</span>
              <span className="text-sm text-muted">({product.numReviews} reviews)</span>
              {product.stockQuantity > 0 && (
                <span className="text-xs text-green-600 font-medium ml-1">✓ In Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="mb-5">
              {product.originalPrice && (
                <span className="text-sm text-muted line-through mr-2">{formatPrice(product.originalPrice)}</span>
              )}
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <span className="ml-2 text-sm text-red-500 font-medium">{discount}% off</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted mb-6">{product.description}</p>

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2.5">
                  Color: <span className="text-warm font-normal">{selColor}</span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button key={c} title={c} onClick={() => setSelColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all
                        ${selColor === c ? 'border-dark ring-1 ring-offset-1 ring-dark' : 'border-transparent'}
                        ${c === '#FAF7F2' || c === 'White' ? 'border-soft' : ''}`}
                      style={{ background: c.startsWith('#') ? c : c }}/>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase">Size</p>
                  <button className="text-xs text-warm underline underline-offset-2">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSelSize(s)}
                      className={`px-4 py-2 text-xs border rounded-sm transition-all
                        ${selSize === s ? 'bg-dark text-white border-dark' : 'border-soft text-dark hover:border-dark'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2">Quantity</p>
                <div className="flex items-center border border-soft rounded-sm overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg hover:bg-soft transition-colors">−</button>
                  <span className="w-10 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg hover:bg-soft transition-colors">+</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2">Stock</p>
                <p className={`text-xs font-medium ${product.stockQuantity < 5 ? 'text-red-500' : 'text-muted'}`}>
                  {product.stockQuantity < 5 ? `Only ${product.stockQuantity} left!` : `${product.stockQuantity} available`}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-7">
              <button onClick={handleAddToCart}
                className="flex-1 btn-primary justify-center py-3.5">
                <FiShoppingBag size={16}/> Add to Bag
              </button>
              <button onClick={() => setWishlist(!wishlist)}
                className={`w-12 h-12 border rounded-sm flex items-center justify-center transition-all
                  ${wishlist ? 'border-red-400 bg-red-50' : 'border-soft hover:border-dark'}`}>
                <FiHeart size={17} className={wishlist ? 'fill-red-500 text-red-500' : ''}/>
              </button>
              <button className="w-12 h-12 border border-soft rounded-sm flex items-center justify-center hover:border-dark transition-all">
                <FiShare2 size={17}/>
              </button>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-3 bg-soft rounded-sm p-4">
              {[
                { icon: FiTruck,     title: 'Free Delivery',   desc: 'Orders above ₹999' },
                { icon: FiRefreshCw, title: 'Easy Returns',    desc: '30-day policy' },
                { icon: FiShield,    title: 'Secure Payment',  desc: 'Razorpay encrypted' },
                { icon: FiAward,     title: '100% Authentic',  desc: 'Genuine product' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-2.5">
                  <Icon size={16} className="text-warm mt-0.5 flex-shrink-0"/>
                  <div>
                    <p className="text-xs font-semibold text-dark">{title}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS: Description / Reviews ── */}
        <div className="mt-16 border-t border-soft pt-10">
          <div className="flex gap-0 border-b border-soft mb-8">
            {['description','reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-xs tracking-widest uppercase font-medium transition-all border-b-2
                  ${activeTab === tab ? 'border-dark text-dark' : 'border-transparent text-muted hover:text-dark'}`}>
                {tab === 'reviews' ? `Reviews (${product.numReviews})` : 'Description'}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div className="max-w-3xl">
              <p className="text-sm leading-relaxed text-muted mb-4">{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-5">
                  {product.tags.map((t) => (
                    <span key={t} className="px-3 py-1 bg-soft text-xs rounded-full text-muted tracking-wide">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl space-y-8">
              {/* Rating Summary */}
              {product.numReviews > 0 && (
                <div className="flex items-center gap-8 p-5 bg-soft rounded-sm">
                  <div className="text-center">
                    <p className="font-display text-5xl font-normal">{product.averageRating}</p>
                    <div className="flex gap-0.5 justify-center my-1.5">
                      {[1,2,3,4,5].map((s) => (
                        <FiStar key={s} size={14} className={s <= Math.round(product.averageRating) ? 'fill-accent text-accent' : 'text-soft'}/>
                      ))}
                    </div>
                    <p className="text-xs text-muted">{product.numReviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map((r) => {
                      const cnt = product.reviews.filter((rv) => rv.rating === r).length;
                      const pct = product.numReviews ? Math.round((cnt / product.numReviews) * 100) : 0;
                      return (
                        <div key={r} className="flex items-center gap-2">
                          <span className="text-xs w-5 text-muted">{r}★</span>
                          <div className="flex-1 h-1.5 bg-soft rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }}/>
                          </div>
                          <span className="text-xs text-muted w-8 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-5">
                {product.reviews.map((rv) => (
                  <div key={rv._id} className="pb-5 border-b border-soft last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-warm flex items-center justify-center text-white text-sm font-semibold">
                          {rv.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{rv.name}</p>
                          <p className="text-xs text-muted">{new Date(rv.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <FiStar key={s} size={12} className={s <= rv.rating ? 'fill-accent text-accent' : 'text-soft'}/>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{rv.comment}</p>
                  </div>
                ))}
              </div>

              {/* Review Form */}
              <ReviewForm productId={product._id}/>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
