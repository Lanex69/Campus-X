import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Star,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  MessageSquare,
  Building,
} from 'lucide-react';
import api from '../../services/api.js';
import BookingModal from '../../components/BookingModal.jsx';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.services.getService(id);
        setService(res.service);
        setFeedbacks(res.feedbacks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-2">
        <div className="w-8 h-8 border-2 border-[#143828] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-mono">Loading facility dossier...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center space-y-3">
        <h3 className="text-lg font-bold text-stone-800">Campus facility not found</h3>
        <Link to="/" className="text-xs font-bold text-[#143828] hover:underline">
          Return to Facility Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Catalog</span>
      </Link>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="relative aspect-[21/9] sm:h-72 bg-stone-900 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-stone-900/80 text-white backdrop-blur-xs">
              {service.category}
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#143828] text-white">
              {service.price === 0 ? 'Free Subsidized' : `$${service.price} / slot`}
            </span>
          </div>

          <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{service.averageRating ? service.averageRating.toFixed(1) : '5.0'}</span>
              <span className="text-stone-300">({service.totalRatings || feedbacks.length} verified ratings)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{service.name}</h1>
            <p className="text-xs text-stone-300 flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{service.location}</span>
            </p>
          </div>
        </div>

        {/* Content & Booking CTA */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-stone-500 block">Capacity</span>
                <span className="font-extrabold text-stone-900 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-stone-500" />
                  Max {service.capacity} Persons
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-stone-500 block">Duration</span>
                <span className="font-extrabold text-stone-900 flex items-center gap-1 mt-0.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  {service.duration} mins / slot
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-stone-500 block">Daily Hours</span>
                <span className="font-extrabold text-stone-900 font-mono flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  {service.startTime} - {service.endTime}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-2.5 rounded-lg bg-[#143828] hover:bg-[#1B4D36] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Reserve This Space</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs text-stone-900 uppercase tracking-wider font-mono">
              Facility Description
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Specifications & Amenities */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs text-stone-900 uppercase tracking-wider font-mono">
              Infrastructure & Policies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-2.5 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#143828] shrink-0" />
                <span>Academic Wi-Fi 6 wireless coverage</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-2.5 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#143828] shrink-0" />
                <span>Dedicated power hubs and fast-charge stations</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-2.5 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#143828] shrink-0" />
                <span>Climate-controlled HVAC & acoustic dampening</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-2.5 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#143828] shrink-0" />
                <span>ADA wheelchair accessible turnstiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#143828]" />
            <h2 className="font-extrabold text-stone-900 text-sm">Student Evaluations</h2>
            <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
              {feedbacks.length}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">Post-session feedback</span>
        </div>

        {feedbacks.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No student evaluations recorded yet for this facility.
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-stone-100">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{fb.user?.name || 'Student'}</span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Verified Session
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{fb.rating} / 5</span>
                  </div>
                </div>
                {fb.comment && (
                  <p className="text-xs text-stone-600 italic">"{fb.comment}"</p>
                )}
                <span className="text-[10px] text-stone-400 font-mono block">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingModal && (
        <BookingModal
          service={service}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={() => {}}
        />
      )}
    </div>
  );
}
