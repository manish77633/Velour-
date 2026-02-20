import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, clearError } from '../redux/slices/authSlice';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  const [mode, setMode]   = useState('login'); // 'login' | 'register'
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) toast.error(error); return () => dispatch(clearError()); }, [error, dispatch]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register') {
      if (!form.name.trim()) return toast.error('Name is required');
      if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
      if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
      await dispatch(registerUser({ name: form.name, email: form.email, password: form.password })).unwrap();
      toast.success('Account created! Welcome to VELOUR 🎉');
    } else {
      await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
      toast.success('Welcome back!');
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT — Brand Panel */}
      <div className="hidden lg:flex flex-col justify-center bg-dark px-14 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-warm/10 rounded-full blur-3xl"/>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/8 rounded-full blur-3xl"/>
        </div>
        <div className="relative z-10 max-w-xs">
          <Link to="/" className="font-display text-4xl font-semibold tracking-[0.14em] text-cream block mb-6">
            VEL<span className="text-accent">OUR</span>
          </Link>
          <p className="text-sm leading-relaxed text-cream/50 mb-8">
            Premium fashion curated for every moment in your life. Join thousands of style-conscious Indians.
          </p>
          <div className="space-y-3">
            {[
              'Exclusive member-only offers & early access',
              'Track orders & manage returns easily',
              'Save your wishlist across devices',
              'Personalised style recommendations',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-cream/70">
                <span className="text-accent text-xs">✦</span>
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-muted mb-7">
            {mode === 'login' ? 'Sign in to your VELOUR account' : 'Join VELOUR and start shopping'}
          </p>

          {/* Google Login */}
          <GoogleLoginButton/>

          <div className="flex items-center gap-3 my-5 text-xs text-muted tracking-widest uppercase">
            <span className="flex-1 h-px bg-soft"/>
            or
            <span className="flex-1 h-px bg-soft"/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase text-muted mb-1.5 font-medium">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  type="text" placeholder="Manish Kumar" className="input-field" required/>
              </div>
            )}
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-muted mb-1.5 font-medium">Email Address</label>
              <input name="email" value={form.email} onChange={handleChange}
                type="email" placeholder="your@email.com" className="input-field" required/>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs tracking-[0.12em] uppercase text-muted font-medium">Password</label>
                {mode === 'login' && <a href="#" className="text-xs text-warm hover:underline">Forgot password?</a>}
              </div>
              <input name="password" value={form.password} onChange={handleChange}
                type="password" placeholder="••••••••" className="input-field" required/>
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase text-muted mb-1.5 font-medium">Confirm Password</label>
                <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  type="password" placeholder="••••••••" className="input-field" required/>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-sm text-muted mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-warm hover:underline font-medium">
              {mode === 'login' ? 'Sign up free →' : 'Sign in →'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
