import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const quickPurposes = [
  'Capstone Research',
  'Study Group',
  'Lab Experiment',
  'Athletic Training',
  'Event / Presentation',
];

export default function BookingModal({ service, onClose, onBookingSuccess }) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [date, setDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(service?.startTime || '09:00');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!service) return null;

  // Generate available slots based on operating hours and duration
  const generateSlots = () => {
    const slots = [];
    const [startH, startM] = (service.startTime || '09:00').split(':').map(Number);
    const [endH, endM] = (service.endTime || '17:00').split(':').map(Number);
    const dur = service.duration || 60;

    let cur = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (cur + dur <= end) {
      const h = Math.floor(cur / 60);
      const m = cur % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      cur += dur;
    }
    return slots;
  };

  const slots = generateSlots();

  const getDateOffset = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const quickDates = [
    { label: 'Today', val: getDateOffset(0) },
    { label: 'Tomorrow', val: getDateOffset(1) },
    { label: '+2 Days', val: getDateOffset(2) },
    { label: '+3 Days', val: getDateOffset(3) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) {
      setErrorMsg('Please specify the project or reservation purpose.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.bookings.createBooking({
        serviceId: service._id,
        date,
        startTime,
        numberOfPeople: Number(numberOfPeople),
        purpose: purpose.trim(),
      });

      toast.success(res.message || 'Reservation confirmed! Pass issued.');
      if (onBookingSuccess) onBookingSuccess(res.booking);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedTotal = (service.price || 0) * numberOfPeople;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl border border-stone-200 relative my-auto">
        {/* Modal Header */}
        <div className="relative h-32 bg-[#143828] overflow-hidden text-white p-5 flex flex-col justify-end">
          <img
            src={service.image}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08150f] via-[#0f241a]/60 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
              {service.category} • {service.location}
            </span>
            <h3 className="text-lg font-bold text-white truncate mt-0.5">{service.name}</h3>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#143828]" />
                <span>Date</span>
              </span>
              <span className="text-[11px] font-mono text-stone-500 font-normal">
                {new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </label>

            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {quickDates.map((qd) => (
                <button
                  key={qd.val}
                  type="button"
                  onClick={() => setDate(qd.val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    date === qd.val
                      ? 'bg-[#143828] text-white border-[#143828]'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  {qd.label}
                </button>
              ))}
            </div>

            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828] bg-white"
            />
          </div>

          {/* Time Slot Visual Radio */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#143828]" />
                <span>Available Window ({service.duration} mins)</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#143828]">
                Slot: {startTime}
              </span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-stone-50 rounded-lg border border-stone-200">
              {slots.map((s) => {
                const isSelected = startTime === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStartTime(s)}
                    className={`py-2 px-1 rounded-md text-xs font-mono font-semibold transition cursor-pointer border flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-[#143828] text-white border-[#143828]'
                        : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span>{s}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attendees Stepper */}
          {service.capacity > 1 && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#143828]" />
                  <span>Number of Attendees (Max {service.capacity})</span>
                </span>
                <span className="text-[11px] text-stone-500 font-mono">
                  {service.capacity - numberOfPeople} spots left
                </span>
              </label>

              <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-lg border border-stone-200">
                <button
                  type="button"
                  disabled={numberOfPeople <= 1}
                  onClick={() => setNumberOfPeople((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-md bg-white border border-stone-300 hover:bg-stone-100 flex items-center justify-center text-stone-700 disabled:opacity-40 cursor-pointer transition shadow-2xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1 text-center font-bold text-stone-900 text-sm font-mono">
                  {numberOfPeople} {numberOfPeople === 1 ? 'Person' : 'People'}
                </div>

                <button
                  type="button"
                  disabled={numberOfPeople >= service.capacity}
                  onClick={() => setNumberOfPeople((prev) => Math.min(service.capacity, prev + 1))}
                  className="w-8 h-8 rounded-md bg-white border border-stone-300 hover:bg-stone-100 flex items-center justify-center text-stone-700 disabled:opacity-40 cursor-pointer transition shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Purpose & Project Tags */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Reservation Purpose *
            </label>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickPurposes.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition cursor-pointer ${
                    purpose === p
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              required
              placeholder="e.g. Capstone project group study, thesis GPU training, court practice..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143828] focus:border-[#143828] bg-white font-medium"
            />
          </div>

          {/* Demo Settlement Fee Box */}
          <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-stone-900 block">
                {service.price === 0 ? 'Subsidized Campus Facility' : 'Demo Settlement Amount'}
              </span>
              <span className="text-[11px] text-stone-500">
                {service.price === 0 ? 'No charges apply' : 'Simulated on Campus Card'}
              </span>
            </div>
            <div className="text-right">
              <span className="font-black text-sm font-mono text-stone-900">
                {service.price === 0 ? 'FREE' : `$${estimatedTotal}.00`}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
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
              {submitting ? 'Processing...' : 'Confirm Reservation'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
