import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearProduct, fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { formatPrice, calcDiscount } from '../utils/formatPrice';
import ReviewForm from '../components/product/ReviewForm';
import { Loader } from '../components/common/Loader';
import {
  FiShoppingBag, FiHeart, FiShare2, FiStar,
  FiTruck, FiRefreshCw, FiShield, FiAward, FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  
  const { product, loading, products } = useSelector((s) => s.product);
  
  // Redux Wishlist check
  const { wishlistItems } = useSelector((s) => s.wishlist || { wishlistItems: [] });
  const isWishlisted = wishlistItems?.some((item) => item._id === product?._id);

  const [activeImg,  setActiveImg]  = useState(0);
  const [selSize,    setSelSize]    = useState('');
  const [selColor,   setSelColor]   = useState('');
  const [qty,        setQty]        = useState(1);
  const [activeTab,  setActiveTab]  = useState('description');
  
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products?.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (product) {
      setSelSize(product.sizes?.[0] || '');
      setSelColor(product.colors?.[0] || '');
      setActiveImg(0);
      setQty(1);
    }
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = isSizeGuideOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isSizeGuideOpen]);

  const handleAddToCart = () => {
    if (!selSize) return toast.error('Please select a size');
    dispatch(addToCart({ product, size: selSize, color: selColor, qty }));
    toast.success(`${product.name} added to bag!`);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist ❤️");
    }
  };

  const relatedProducts = useMemo(() => {
    if (!products || !product) return [];
    let related = products.filter((p) => p.category === product.category && p._id !== product._id);
    if (related.length < 4) {
      const others = products.filter((p) => p.category !== product.category && p._id !== product._id);
      related = [...related, ...others];
    }
    return related.slice(0, 4);
  }, [products, product]);

  if (loading) return <div className="pt-16 min-h-screen flex items-center justify-center"><Loader size="lg"/></div>;
  if (!product) return <div className="pt-16 min-h-screen flex items-center justify-center"><p className="text-muted">Product not found.</p></div>;

  const discount  = calcDiscount(product.price, product.originalPrice);
  const images    = product.images?.length ? product.images : ['/placeholder.jpg'];

  return (
    <main className="pt-16 bg-cream min-h-screen pb-20 relative">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-8">
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
            <div className="aspect-[3/4] bg-soft rounded-sm overflow-hidden mb-3 relative group">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all
                      ${activeImg === i ? 'border-warm' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div>
            <p className="section-label mb-2 tracking-[0.2em] uppercase text-xs font-semibold text-muted">{product.category}'s Collection</p>
            <h1 className="font-display text-3xl md:text-4xl font-normal leading-tight mb-4 text-dark">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-soft">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <FiStar key={s} size={15} className={s <= Math.round(product.averageRating || 0) ? 'fill-accent text-accent' : 'text-soft'}/>
                ))}
              </div>
              <span className="text-sm font-semibold">{product.averageRating || "New"}</span>
              <span className="text-sm text-muted">({product.numReviews || 0} reviews)</span>
              {product.stockQuantity > 0 && (
                <span className="text-xs text-green-600 font-medium ml-1">✓ In Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="mb-5 flex items-end gap-3">
              <span className="text-3xl font-semibold text-dark">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-muted line-through mb-1">{formatPrice(product.originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="mb-1.5 text-xs tracking-wider bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-sm uppercase">{discount}% off</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted mb-8">{product.description}</p>

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3">
                  Color: <span className="text-warm font-normal">{selColor}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button key={c} title={c} onClick={() => setSelColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm
                        ${selColor === c ? 'border-dark ring-2 ring-offset-2 ring-dark scale-110' : 'border-transparent hover:scale-110'}
                        ${c === '#FAF7F2' || c.toLowerCase() === 'white' ? 'border-soft' : ''}`}
                      style={{ background: c.startsWith('#') ? c : c }}/>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase">Size</p>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-warm underline underline-offset-4 font-bold tracking-widest uppercase hover:text-dark transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSelSize(s)}
                      className={`min-w-[3rem] px-4 py-2.5 text-xs font-medium border rounded-sm transition-all
                        ${selSize === s ? 'bg-dark text-white border-dark shadow-md' : 'border-soft text-dark hover:border-dark bg-white'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty & Stock */}
            <div className="flex items-center gap-8 mb-8">
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3">Quantity</p>
                <div className="flex items-center border border-soft rounded-sm overflow-hidden bg-white">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-lg hover:bg-soft transition-colors text-dark">−</button>
                  <span className="w-10 text-center text-sm font-semibold text-dark">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))} className="w-10 h-10 flex items-center justify-center text-lg hover:bg-soft transition-colors text-dark">+</button>
                </div>
              </div>
              <div className="mt-6">
                <p className={`text-sm font-semibold flex items-center gap-2 ${product.stockQuantity < 5 ? 'text-red-500' : 'text-green-600'}`}>
                  {product.stockQuantity < 5 ? (
                    <><FiRefreshCw className="animate-spin-slow"/> Only {product.stockQuantity} left in stock!</>
                  ) : (
                    <><FiTruck/> In Stock & Ready to Ship</>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} className="flex-1 btn-primary justify-center py-4 text-sm font-bold tracking-widest uppercase">
                <FiShoppingBag size={18} className="mr-2 inline-block"/> Add to Bag
              </button>
              
              <button onClick={handleWishlistToggle}
                className={`w-14 h-14 border rounded-sm flex items-center justify-center transition-all bg-white
                  ${isWishlisted ? 'border-red-400 bg-red-50 shadow-inner' : 'border-soft hover:border-dark'}`}>
                <FiHeart size={20} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-dark'}/>
              </button>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 bg-soft rounded-sm p-5 border border-soft">
              {[
                { icon: FiTruck,     title: 'Free Delivery',   desc: 'Orders above ₹999' },
                { icon: FiRefreshCw, title: 'Easy Returns',    desc: '30-day policy' },
                { icon: FiShield,    title: 'Secure Payment',  desc: 'Razorpay encrypted' },
                { icon: FiAward,     title: '100% Authentic',  desc: 'Genuine product' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon size={18} className="text-warm mt-0.5 flex-shrink-0"/>
                  <div>
                    <p className="text-xs font-bold text-dark uppercase tracking-wide mb-0.5">{title}</p>
                    <p className="text-[11px] text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS: Description / Reviews ── */}
        <div className="mt-20 border-t border-soft pt-12">
          <div className="flex gap-2 border-b border-soft mb-10">
            {['description','reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-bold transition-all border-b-2
                  ${activeTab === tab ? 'border-dark text-dark' : 'border-transparent text-muted hover:text-dark'}`}>
                {tab === 'reviews' ? `Reviews (${product.numReviews || 0})` : 'Description'}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div className="max-w-3xl">
              <p className="text-base leading-[1.8] text-muted mb-6">{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex gap-2.5 flex-wrap mt-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-dark mt-1 mr-2">Tags:</span>
                  {product.tags.map((t) => (
                    <span key={t} className="px-4 py-1 bg-white border border-soft text-xs rounded-full text-muted tracking-widest uppercase hover:border-dark transition-colors cursor-pointer">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl space-y-10">
              {/* Rating Summary */}
              {product.numReviews > 0 && (
                <div className="flex flex-col md:flex-row items-center gap-10 p-8 bg-white border border-soft rounded-sm">
                  <div className="text-center md:border-r md:border-soft md:pr-10">
                    <p className="font-display text-6xl font-normal text-dark">{product.averageRating}</p>
                    <div className="flex gap-1 justify-center my-3">
                      {[1,2,3,4,5].map((s) => (
                        <FiStar key={s} size={16} className={s <= Math.round(product.averageRating) ? 'fill-accent text-accent' : 'text-soft'}/>
                      ))}
                    </div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-muted">{product.numReviews} reviews</p>
                  </div>
                  <div className="flex-1 w-full space-y-2.5">
                    {[5,4,3,2,1].map((r) => {
                      const cnt = product.reviews.filter((rv) => rv.rating === r).length;
                      const pct = product.numReviews ? Math.round((cnt / product.numReviews) * 100) : 0;
                      return (
                        <div key={r} className="flex items-center gap-3">
                          <span className="text-xs font-bold w-6 text-dark flex items-center">{r} <FiStar size={10} className="ml-0.5 fill-dark text-dark"/></span>
                          <div className="flex-1 h-2 bg-soft rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }}/>
                          </div>
                          <span className="text-xs font-medium text-muted w-10 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {product.reviews?.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((rv) => (
                    <div key={rv._id} className="pb-6 border-b border-soft last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-white text-base font-bold shadow-sm">
                            {rv.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-dark">{rv.name}</p>
                            <p className="text-[11px] uppercase tracking-widest text-muted mt-0.5">{new Date(rv.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map((s) => (
                            <FiStar key={s} size={13} className={s <= rv.rating ? 'fill-accent text-accent' : 'text-soft'}/>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted leading-[1.7] mt-2">{rv.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted italic">No reviews yet. Be the first to review this product!</p>
              )}

              {/* Review Form */}
              <div className="bg-soft p-6 md:p-8 rounded-sm">
                <h3 className="text-lg font-display mb-4 text-dark">Write a Review</h3>
                <ReviewForm productId={product._id}/>
              </div>
            </div>
          )}
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-soft">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-3xl font-normal text-dark">You Might Also Like</h2>
              <Link to={`/shop?category=${product.category}`} className="text-[10px] font-bold tracking-[0.2em] uppercase text-warm hover:text-dark transition-colors border-b border-warm hover:border-dark pb-1">
                View Collection
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((relProd) => {
                const relDiscount = calcDiscount(relProd.price, relProd.originalPrice);
                
                // NAYA: Related product ke liye bhi check karein ki wishlist me hai ya nahi
                const isRelWishlisted = wishlistItems?.some((item) => item._id === relProd._id);

                return (
                  <Link key={relProd._id} to={`/product/${relProd._id}`} className="group block no-underline">
                    <div className="aspect-[3/4] bg-soft rounded-sm overflow-hidden mb-4 relative">
                      <img src={relProd.images?.[0] || '/placeholder.jpg'} alt={relProd.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      
                      {/* Hover Action / Wishlist icon */}
                      <button 
                        onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           if (isRelWishlisted) {
                             dispatch(removeFromWishlist(relProd._id));
                             toast.success("Removed from wishlist");
                           } else {
                             dispatch(addToWishlist(relProd));
                             toast.success("Added to wishlist ❤️");
                           }
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                          ${isRelWishlisted 
                            ? 'bg-white opacity-100 text-red-500' 
                            : 'bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 text-dark hover:bg-white'
                          }`}
                      >
                        <FiHeart size={14} className={isRelWishlisted ? 'fill-red-500' : ''}/>
                      </button>

                      {relDiscount > 0 && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 uppercase rounded-sm shadow-sm">
                          Sale
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted mb-1.5">{relProd.category}</p>
                      <h3 className="text-sm font-medium text-dark truncate mb-1.5 group-hover:text-warm transition-colors">{relProd.name}</h3>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-dark">{formatPrice(relProd.price)}</span>
                        {relProd.originalPrice && relProd.originalPrice > relProd.price && (
                          <span className="text-xs text-muted line-through">{formatPrice(relProd.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* ── SIZE GUIDE MODAL (POPUP) ── */}
      {isSizeGuideOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity"
          onClick={() => setIsSizeGuideOpen(false)} 
        >
          <div 
            className="bg-cream w-full max-w-lg rounded-sm shadow-2xl overflow-hidden relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="px-6 py-5 border-b border-soft flex justify-between items-center bg-white">
              <h3 className="font-display text-2xl text-dark">Size Guide</h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="p-2 text-muted hover:text-dark hover:bg-soft rounded-full transition-colors">
                <FiX size={22} />
              </button>
            </div>
            <div className="p-6 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-dark text-[11px] uppercase tracking-widest text-muted">
                      <th className="py-3 pr-4 font-bold">Size</th>
                      <th className="py-3 px-4 font-bold">Waist (in)</th>
                      <th className="py-3 px-4 font-bold">Chest (in)</th>
                      <th className="py-3 pl-4 font-bold text-right">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-dark">
                    {[
                      { s: 'XS', w: '26 - 28', c: '34 - 36', l: '27' },
                      { s: 'S',  w: '28 - 30', c: '36 - 38', l: '28' },
                      { s: 'M',  w: '30 - 32', c: '38 - 40', l: '29' },
                      { s: 'L',  w: '32 - 34', c: '40 - 42', l: '30' },
                      { s: 'XL', w: '34 - 36', c: '42 - 44', l: '31' },
                      { s: 'XXL',w: '36 - 38', c: '44 - 46', l: '32' },
                    ].map((row) => (
                      <tr key={row.s} className="border-b border-soft hover:bg-soft/50 transition-colors">
                        <td className="py-3.5 pr-4 font-bold text-dark">{row.s}</td>
                        <td className="py-3.5 px-4 text-muted">{row.w}</td>
                        <td className="py-3.5 px-4 text-muted">{row.c}</td>
                        <td className="py-3.5 pl-4 text-muted text-right">{row.l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 pt-5 border-t border-soft text-center">
                <p className="text-[11px] uppercase tracking-widest text-muted">
                  Measurements are provided as a guide only.<br/> Fits may vary by style or personal preference.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}