import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Star,
  QrCode,
  AlertCircle,
  Building,
  CheckCircle,
} from 'lucide-react';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import PaymentModal from '../../components/PaymentModal.jsx';
import FeedbackModal from '../../components/FeedbackModal.jsx';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.bookings.getMyBookings({
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });
      setBookings(res.bookings || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleCancel = async (bookingId) => {
    const reason = prompt('Please provide a reason for cancelling this reservation:');
    if (!reason || !reason.trim()) return;

    try {
      await api.bookings.cancelBooking(bookingId, reason.trim());
      toast.success('Reservation cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Cancellation failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1 font-mono">
            Access Passes & Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Campus Passes & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            Active facility reservations, verified turnstile tokens, demo fee receipts, and session evaluations.
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
                  ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#143828] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-mono">Loading reservation tokens...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No reservations found</h3>
          <p className="text-xs text-stone-500">
            {filterStatus === 'all'
              ? 'You have not reserved any campus spaces yet.'
              : `No reservations matching status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isPendingOrConfirmed = ['pending', 'confirmed'].includes(booking.status);
            const isCompleted = booking.status === 'completed';
            const hasPendingPayment = booking.payment && booking.payment.status === 'pending';
            const refCode = `SC-2026-${booking._id.substring(booking._id.length - 6).toUpperCase()}`;

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:border-stone-400 transition flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-100"
              >
                {/* Main Pass Information */}
                <div className="p-5 sm:p-6 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={booking.status} />
                      <span className="font-mono text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {refCode}
                      </span>
                    </div>

                    {booking.payment && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          booking.payment.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : booking.payment.status === 'refunded'
                            ? 'bg-stone-100 text-stone-600 border border-stone-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        Demo Fee: {booking.payment.status} (${booking.payment.amount})
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-stone-900">
                      {booking.service?.name || 'Campus Space'}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{booking.service?.location}</span>
                    </p>
                  </div>

                  {/* Schedule Metadata */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs text-stone-700">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block font-mono">
                        Date
                      </span>
                      <span className="font-bold text-stone-900 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        {new Date(booking.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block font-mono">
                        Time Slot
                      </span>
                      <span className="font-bold text-stone-900 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block font-mono">
                        Attendees
                      </span>
                      <span className="font-bold text-stone-900 flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        {booking.numberOfPeople} Person(s)
                      </span>
                    </div>
                  </div>

                  {booking.purpose && (
                    <p className="text-xs text-stone-600">
                      <strong className="text-stone-800">Purpose:</strong> "{booking.purpose}"
                    </p>
                  )}

                  {booking.adminNotes && (
                    <div className="text-xs text-stone-800 bg-stone-100 p-3 rounded-lg border border-stone-200 space-y-0.5">
                      <strong className="block text-[10px] font-mono uppercase text-stone-500">
                        Admin Remark:
                      </strong>
                      <p>{booking.adminNotes}</p>
                    </div>
                  )}

                  {booking.cancellationReason && (
                    <div className="text-xs text-rose-900 bg-rose-50 p-3 rounded-lg border border-rose-200 space-y-0.5">
                      <strong className="block text-[10px] font-mono uppercase text-rose-700">
                        Cancellation Reason:
                      </strong>
                      <p>{booking.cancellationReason}</p>
                    </div>
                  )}
                </div>

                {/* Right Turnstile Stub / QR Mockup */}
                <div className="p-5 sm:p-6 bg-stone-50/60 md:w-60 flex flex-col justify-between items-center text-center space-y-3">
                  <div className="space-y-1 w-full">
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                      Turnstile Token
                    </span>

                    <div className="w-20 h-20 mx-auto bg-white p-1.5 rounded-lg border border-stone-300 shadow-2xs flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-stone-900" />
                    </div>

                    <span className="font-mono text-[10px] text-stone-400 block truncate">
                      {booking._id}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="w-full space-y-2 pt-2">
                    {hasPendingPayment && (
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForPayment(booking)}
                        className="w-full py-2 px-3 bg-[#143828] hover:bg-[#1B4D36] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Settle Fee (${booking.payment.amount})</span>
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForFeedback(booking)}
                        className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Submit Review</span>
                      </button>
                    )}

                    {isPendingOrConfirmed && (
                      <button
                        type="button"
                        onClick={() => handleCancel(booking._id)}
                        className="w-full py-1.5 px-3 text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBookingForPayment && (
        <PaymentModal
          booking={selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onPaymentSuccess={fetchBookings}
        />
      )}

      {selectedBookingForFeedback && (
        <FeedbackModal
          booking={selectedBookingForFeedback}
          onClose={() => setSelectedBookingForFeedback(null)}
          onFeedbackSuccess={fetchBookings}
        />
      )}
    </div>
  );
}
