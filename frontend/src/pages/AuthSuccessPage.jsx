import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTokenUser } from '../redux/slices/authSlice';
import api from '../services/api';
import { Loader } from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function AuthSuccessPage() {
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { navigate('/login'); return; }

    // Store token first so api.js interceptor can use it
    localStorage.setItem('token', token);

    // Fetch user profile with the token
    api.get('/auth/me')
      .then(({ data }) => {
        dispatch(setTokenUser({ token, user: data.user }));
        toast.success(`Welcome, ${data.user.name}! 🎉`);
        navigate('/');
      })
      .catch(() => {
        localStorage.removeItem('token');
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      });
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-4">
      <Loader size="lg"/>
      <p className="text-sm text-muted">Completing sign in with Google...</p>
    </div>
  );
}
