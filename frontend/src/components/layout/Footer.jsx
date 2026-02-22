import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark text-cream/70">
      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-3xl font-semibold tracking-[0.14em] text-cream block mb-4">
              VEL<span className="text-accent">OUR</span>
            </Link>
            <p className="text-sm leading-relaxed text-cream/50 mb-6">
              Premium fashion for Men, Women & Kids. Crafted with care, delivered with love.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-200">
                  <Icon size={15}/>
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs tracking-[0.22em] uppercase text-accent mb-5 font-medium">Shop</h3>
            <div className="flex flex-col gap-3">
              {[['New Arrivals','/shop?sort=new'],['Men','/shop?category=Men'],['Women','/shop?category=Women'],['Kids','/shop?category=Kids'],['Sale','/shop?sort=price_low']].map(([label,to]) => (
                <Link key={label} to={to} className="text-sm text-cream/55 hover:text-cream transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs tracking-[0.22em] uppercase text-accent mb-5 font-medium">Help</h3>
            <div className="flex flex-col gap-3">
              {['FAQ','Shipping & Delivery','Returns & Exchanges','Size Guide','Contact Us','Track Your Order'].map((item) => (
                <a key={item} href="#" className="text-sm text-cream/55 hover:text-cream transition-colors">{item}</a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs tracking-[0.22em] uppercase text-accent mb-5 font-medium">Newsletter</h3>
            <p className="text-sm text-cream/50 leading-relaxed mb-4">
              Get early access to new arrivals and exclusive member offers.
            </p>
            <div className="flex border border-cream/20 rounded-sm overflow-hidden">
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-cream placeholder-cream/30 outline-none"/>
              <button className="px-3 bg-warm hover:bg-accent transition-colors text-white">
                <FiMail size={16}/>
              </button>
            </div>
            <div className="mt-5">
              <p className="text-xs tracking-[0.18em] uppercase text-accent mb-3">We Accept</p>
              <div className="flex gap-2 flex-wrap">
                {['Razorpay','UPI','Net Banking','Cards'].map((m) => (
                  <span key={m} className="px-2 py-1 border border-cream/15 rounded text-xs text-cream/50">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/35 text-center md:text-left">
            © 2026 <span className="text-cream/60 font-medium">Manish Kumar</span>. All rights reserved. Built with ❤️ in India.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy','Terms of Service','MIT License'].map((item) => (
              <a key={item} href="#" className="text-xs text-cream/35 hover:text-cream/60 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
