import React, { useState } from 'react';
import { X, Star, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const sentimentLabels = {
  1: 'Needs Improvement',
  2: 'Below Expectations',
  3: 'Satisfactory / Good',
  4: 'Very Good Experience',
  5: 'Exceptional Facility',
};

const aspectChips = [
  'Cleanliness',
  'Fast Wi-Fi',
  'Quiet Environment',
  'Modern Equipment',
  'Punctual Turnstile',
];

export default function FeedbackModal({ booking, onClose, onFeedbackSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!booking) return null;

  const currentVal = hoverRating || rating;

  const handleChipClick = (chip) => {
    if (comment.includes(chip)) return;
    setComment((prev) => (prev ? `${prev}, ${chip}` : chip));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.feedback.createFeedback({
        bookingId: booking._id,
        rating,
        comment: comment.trim(),
      });
      toast.success(res.message || 'Feedback recorded! Thank you.');
      if (onFeedbackSuccess) onFeedbackSuccess(res.feedback);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-stone-200 relative my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="text-[10px] font-mono uppercase font-bold text-stone-500 tracking-wider block mb-1">
            Session Evaluation
          </span>
          <h3 className="text-xl font-extrabold text-stone-900">Facility Quality Rating</h3>
          <p className="text-xs text-stone-500 mt-0.5">{booking.service?.name}</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="text-center space-y-2 py-2 bg-stone-50 rounded-lg border border-stone-200">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-hidden cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      currentVal >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300 hover:text-stone-400'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-stone-700 font-mono">
              {sentimentLabels[currentVal]}
            </div>
          </div>

          {/* Quick Aspect Chips */}
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1.5 font-mono">
              Quick Tags:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {aspectChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded border transition cursor-pointer ${
                    comment.includes(chip)
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Written Evaluation (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Comments on equipment status, cleanliness, sound isolation, or hardware needs..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143828] focus:border-[#143828] bg-white font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-[#143828] hover:bg-[#1B4D36] disabled:bg-stone-300 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Evaluation'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
