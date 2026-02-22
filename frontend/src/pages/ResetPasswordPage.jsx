import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      await api.put(`/users/reset-password/${token}`, { password });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Token invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-soft w-full max-w-md">
        <h2 className="font-display text-2xl text-center mb-6">New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="password" placeholder="New Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border-b border-soft py-2 outline-none"/>
            <input type="password" placeholder="Confirm Password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="w-full border-b border-soft py-2 outline-none"/>
            <button type="submit" disabled={loading} className="w-full bg-black text-[#C4A882] py-3 text-xs uppercase font-bold">
              {loading ? 'Resetting...' : 'Set Password'}
            </button>
        </form>
      </div>
    </div>
  );
}