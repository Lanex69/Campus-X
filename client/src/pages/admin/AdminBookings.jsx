import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Calendar, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.admin.getAllBookings({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: search.trim() || undefined,
        page,
        limit: 15,
      });
      setBookings(res.bookings || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    let note = '';
    if (status === 'rejected') {
      note = prompt('Reason for declining this booking request:') || 'Capacity or scheduling conflict';
    } else {
      note = prompt('Admin note / remarks (optional):') || '';
    }

    try {
      await api.admin.updateBookingStatus(id, status, note);
      toast.success(`Booking status changed to ${status}`);
      fetchBookings(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Access Allocation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Campus Bookings Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            Approve requests, verify student capacity, transition completed sessions, or issue refunds.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-semibold">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md capitalize transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#143828] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#143828] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-mono">Loading bookings registry...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No bookings found</h3>
          <p className="text-xs text-stone-500">
            No booking records match the selected status filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-4 font-bold">Pass Ref</th>
                  <th className="py-3 px-4 font-bold">Student</th>
                  <th className="py-3 px-4 font-bold">Facility</th>
                  <th className="py-3 px-4 font-bold">Date & Window</th>
                  <th className="py-3 px-4 font-bold">Party</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Demo Pay</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      #{b._id.substring(b._id.length - 6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block">{b.user?.name || 'Student'}</span>
                      <span className="text-[10px] text-stone-400 block font-mono">{b.user?.email}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800">
                      {b.service?.name}
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-mono">
                      <div>{new Date(b.date).toLocaleDateString()}</div>
                      <div className="text-[10px] text-stone-400">{b.startTime} - {b.endTime}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-mono">{b.numberOfPeople} pax</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3 px-4">
                      {b.payment ? (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          b.payment.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {b.payment.status} (${b.payment.amount})
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[10px] font-mono">Free</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {b.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(b._id, 'confirmed')}
                              className="px-2.5 py-1 bg-[#143828] hover:bg-[#1B4D36] text-white rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Approve Booking"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(b._id, 'rejected')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-md text-[11px] font-bold border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                              title="Decline Booking"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {b.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(b._id, 'completed')}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                            title="Mark Session Completed"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Mark Completed</span>
                          </button>
                        )}
                      </div>
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
                Page {pagination.page} of {pagination.pages} ({pagination.total} records)
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchBookings(pagination.page - 1)}
                  className="px-3 py-1 rounded-md border border-stone-300 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchBookings(pagination.page + 1)}
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
