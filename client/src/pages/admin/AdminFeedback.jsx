import React, { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchFeedback = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.admin.getAllFeedback({ page, limit: 15 });
      setFeedbacks(res.feedbacks || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-1">
          Quality & Satisfaction
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Student Feedback & Facility Ratings
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
          Direct evaluations submitted by verified students after completing reservations.
        </p>
      </div>

      {/* Feedback Table */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#143828] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-mono">Loading student reviews...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No feedback submitted yet</h3>
          <p className="text-xs text-stone-500">
            Reviews will appear once students complete sessions and provide ratings.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-4 font-bold">Student</th>
                  <th className="py-3 px-4 font-bold">Facility</th>
                  <th className="py-3 px-4 font-bold">Rating</th>
                  <th className="py-3 px-4 font-bold">Written Feedback</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {feedbacks.map((f) => (
                  <tr key={f._id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {f.user?.name || 'Student'}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800">
                      {f.service?.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{f.rating} / 5</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-700 max-w-md leading-relaxed">
                      {f.comment ? `"${f.comment}"` : <span className="text-stone-400 italic">No comment provided</span>}
                    </td>
                    <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs font-mono">
              <span className="text-stone-500">
                Page {pagination.page} of {pagination.pages} ({pagination.total} reviews)
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchFeedback(pagination.page - 1)}
                  className="px-3 py-1 rounded-md border border-stone-300 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchFeedback(pagination.page + 1)}
                  className="px-3 py-1 rounded-md border border-stone-300 disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
