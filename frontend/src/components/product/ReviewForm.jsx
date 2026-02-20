import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReview } from '../../redux/slices/productSlice';
import { FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId }) => {
  const dispatch          = useDispatch();
  const { user }          = useSelector((s) => s.auth);
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return (
    <div className="bg-soft rounded-sm p-5 text-center">
      <p className="text-sm text-muted mb-3">Please sign in to write a review.</p>
      <a href="/login" className="btn-primary py-2 px-5 text-xs">Sign In</a>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating)   return toast.error('Please select a rating');
    if (!comment.trim()) return toast.error('Please write a comment');

    setLoading(true);
    try {
      await dispatch(addReview({ productId, reviewData: { rating, comment } })).unwrap();
      toast.success('Review submitted! Thank you.');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-soft rounded-sm p-5">
      <h3 className="text-xs font-semibold tracking-[0.15em] uppercase mb-4">Write a Review</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <p className="text-xs text-muted mb-2 tracking-wider uppercase">Your Rating</p>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((s) => (
            <button key={s} type="button"
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(s)}
              className="transition-transform hover:scale-110">
              <FiStar size={28}
                className={(hover || rating) >= s ? 'fill-accent text-accent' : 'text-soft stroke-muted'}/>
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="text-xs text-muted mb-1.5 block tracking-wider uppercase">Your Review</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)}
          rows={4} placeholder="Share your experience with this product..."
          className="input-field resize-none"/>
      </div>

      <button type="submit" disabled={loading}
        className="btn-primary py-2.5 px-6 text-xs disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
