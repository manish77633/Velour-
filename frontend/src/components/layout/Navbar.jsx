import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleCart } from '../../redux/slices/cartSlice';
import {
  FiShoppingBag, FiUser, FiHeart, FiSearch,
  FiMenu, FiX, FiLogOut, FiPackage, FiChevronDown,
} from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useSelector((s) => s.auth);
  const { totalQty } = useSelector((s) => s.cart);
  
  // Redux Wishlist State for Badge
  const { wishlistItems } = useSelector((s) => s.wishlist || { wishlistItems: [] });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserDropdown(false); }, [location]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'New Arrivals', to: '/shop?sort=new' },
    { label: 'Men',          to: '/shop?category=Men' },
    { label: 'Women',        to: '/shop?category=Women' },
    { label: 'Kids',         to: '/shop?category=Kids' },
    { label: 'Sale',         to: '/shop?sort=price_low' },
    { label: 'About',        to: '/about' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-soft' : 'bg-cream/90 backdrop-blur-sm'}`}>
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-semibold tracking-[0.14em] text-dark hover:text-warm transition-colors">
            VEL<span className="text-warm">OUR</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to}
                className="text-xs font-medium tracking-[0.13em] uppercase text-dark hover:text-warm
                           border-b border-transparent hover:border-warm transition-all duration-200 pb-0.5">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-soft transition-colors">
              <FiSearch size={18} />
            </button>

            {/* Wishlist */}
            <Link to="/profile?tab=wishlist" className="w-10 h-10 hidden md:flex items-center justify-center rounded-full hover:bg-soft transition-colors relative">
              <FiHeart size={18} />
              {wishlistItems?.length > 0 && (
                <span className="absolute top-1 right-1 bg-warm text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => dispatch(toggleCart())}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-soft transition-colors relative">
              <FiShoppingBag size={18} />
              {totalQty > 0 && (
                <span className="absolute top-1 right-1 bg-warm text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {totalQty}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative hidden md:block">
                <button onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-soft transition-colors">
                  {user.profilePicture
                    ? <img src={user.profilePicture} alt={user.name} className="w-7 h-7 rounded-full object-cover"/>
                    : <div className="w-7 h-7 rounded-full bg-warm flex items-center justify-center text-white text-xs font-semibold">
                        {user.name?.[0]?.toUpperCase()}
                      </div>}
                  <FiChevronDown size={13} className={`transition-transform ${userDropdown ? 'rotate-180' : ''}`}/>
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-12 bg-white border border-soft rounded shadow-lg w-48 py-1 z-50">
                    <div className="px-4 py-2 border-b border-soft">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-cream transition-colors">
                      <FiUser size={14}/> My Account
                    </Link>
                    <Link to="/profile?tab=orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-cream transition-colors">
                      <FiPackage size={14}/> My Orders
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-cream transition-colors w-full text-left">
                      <FiLogOut size={14}/> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="hidden md:flex btn-primary py-2 px-4 text-xs">
                Sign In
              </Link>
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-soft transition-colors ml-1">
              {menuOpen ? <FiX size={20}/> : <FiMenu size={20}/>}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-soft bg-cream px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-screen-xl mx-auto flex gap-2">
              <input type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field flex-1"
                autoFocus/>
              <button type="submit" className="btn-primary px-5 py-2.5">Search</button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-soft bg-cream px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to}
                className="py-3 text-sm tracking-widest uppercase border-b border-soft font-medium text-dark hover:text-warm transition-colors">
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" className="py-3 text-sm tracking-widest uppercase border-b border-soft">My Account</Link>
                <button onClick={handleLogout} className="py-3 text-sm tracking-widest uppercase text-red-500 text-left">Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="py-3 text-sm tracking-widest uppercase">Sign In / Register</Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;