import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter email');
    setLoading(true);
    try {
      await api.post('/users/forgot-password', { email });
      setSent(true);
      toast.success('Link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-soft w-full max-w-md text-center">
        <h2 className="font-display text-2xl mb-4">Reset Password</h2>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-muted">Enter your email address to receive a reset link.</p>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-b border-soft py-2 outline-none text-center" placeholder="email@example.com" />
            <button type="submit" disabled={loading} className="w-full bg-black text-[#C4A882] py-3 text-xs uppercase font-bold">
              {loading ? 'Sending...' : 'Send Link'}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-green-600 font-bold mb-2">Check your inbox!</p>
            <p className="text-sm text-muted">We have sent a password reset link to your email.</p>
          </div>
        )}
        <div className="mt-6">
            <Link to="/login" className="text-xs text-muted underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}