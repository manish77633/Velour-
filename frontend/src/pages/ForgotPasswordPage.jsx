import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    
    setLoading(true);
    try {
      // Backend API call to send OTP/Reset Link
      await api.post('/users/forgot-password', { email });
      setIsSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-6 py-20">
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-soft text-center">
        
        <div className="w-16 h-16 bg-[#1C1917] rounded-full flex items-center justify-center mx-auto mb-6">
          <FiMail size={24} className="text-[#C4A882]" />
        </div>

        <h1 className="font-display text-3xl text-dark mb-2">Reset Password</h1>
        
        {!isSent ? (
          <>
            <p className="text-sm text-muted mb-8 leading-relaxed">
              Enter your registered email address below and we'll send you instructions to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full border-b border-soft py-3 focus:border-warm outline-none bg-transparent transition-all text-sm"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1C1917] text-[#C4A882] py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-green-600 font-medium mb-8 leading-relaxed bg-green-50 p-4 rounded-lg">
              We have sent a password reset link to <b>{email}</b>. Please check your inbox and spam folder.
            </p>
            <button 
              onClick={() => setIsSent(false)}
              className="text-xs uppercase tracking-widest font-bold text-warm hover:text-dark transition-colors underline underline-offset-4 mb-4 block w-full"
            >
              Try another email
            </button>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-soft">
          <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-dark transition-colors">
            <FiArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}