import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Users,
  Clock,
  Star,
  BookOpen,
  Cpu,
  Trophy,
  Bus,
  Film,
  Package,
  ArrowRight,
  X,
  Calendar,
  AlertCircle,
  RefreshCw,
  Building,
  CheckCircle,
} from 'lucide-react';
import api from '../../services/api.js';
import BookingModal from '../../components/BookingModal.jsx';

const categories = [
  { id: 'all', label: 'All Services', icon: Building },
  { id: 'Library', label: 'Library Study Rooms', icon: BookOpen },
  { id: 'Computer Lab', label: 'Computer Labs', icon: Cpu },
  { id: 'Sports', label: 'Sports Facilities', icon: Trophy },
  { id: 'Auditorium', label: 'Auditorium', icon: Film },
  { id: 'Shuttle', label: 'Campus Shuttle', icon: Bus },
  { id: 'Equipment', label: 'Equipment Rental', icon: Package },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [availableDay, setAvailableDay] = useState('');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchServices = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.services.getServices({
        category: category !== 'all' ? category : undefined,
        search: search.trim() || undefined,
        priceMax: priceMax || undefined,
        availableDay: availableDay || undefined,
        page,
        limit: 9,
      });
      setServices(res.services || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError(err.message || 'Unable to connect to campus services database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1);
  }, [category, priceMax, availableDay]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-10">
      {/* 2-Column Editorial Hero */}
      <section className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-10 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold tracking-wide uppercase font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Campus Resource Registry • Fall 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Reserve university facilities, compute clusters, & equipment.
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Centralized reservations for acoustic study rooms, GPU computing terminals, athletic courts, and lecture halls. Instant digital turnstile credentials generated upon booking.
            </p>

            {/* Integrated Search Input */}
            <div className="pt-2 max-w-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchServices(1);
                }}
                className="flex items-center gap-2 p-1.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus-within:border-[#143828] focus-within:ring-1 focus-within:ring-[#143828] transition"
              >
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by facility name, lab code, or building..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden font-medium"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#143828] hover:bg-[#1B4D36] text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                >
                  Find Space
                </button>
              </form>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-stone-100 text-stone-600 text-xs">
              <div>
                <span className="font-black text-stone-900 text-base font-mono block">6 Venues</span>
                <span className="text-[11px] text-stone-500">Managed Categories</span>
              </div>
              <div>
                <span className="font-black text-stone-900 text-base font-mono block">Zero-Fee</span>
                <span className="text-[11px] text-stone-500">Subsidized Options</span>
              </div>
              <div>
                <span className="font-black text-stone-900 text-base font-mono block">Instant</span>
                <span className="text-[11px] text-stone-500">Turnstile Clearance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3] bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80"
                alt="University Library Architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-300 block mb-0.5">
                  CAMPUS HIGHLIGHT
                </span>
                <p className="text-sm font-bold">Central Library Complex & Silent Study Pods</p>
                <p className="text-[11px] text-stone-300">Wing A • Open 08:00 – 22:00 Daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Discovery Section */}
      <section className="space-y-6">
        {/* Category Navigation Tabs */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Select Category
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {pagination.total} facilities cataloged
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    isSelected
                      ? 'bg-[#143828] text-white border-[#143828] shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-stone-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-stone-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#143828]" />
              <span>Filters:</span>
            </div>

            {/* Day of Week */}
            <select
              value={availableDay}
              onChange={(e) => setAvailableDay(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] font-medium text-stone-700 text-xs focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
            >
              <option value="">Any Operating Day</option>
              <option value="Mon">Mondays</option>
              <option value="Tue">Tuesdays</option>
              <option value="Wed">Wednesdays</option>
              <option value="Thu">Thursdays</option>
              <option value="Fri">Fridays</option>
              <option value="Sat">Saturdays</option>
              <option value="Sun">Sundays</option>
            </select>

            {/* Price Filter */}
            <select
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] font-medium text-stone-700 text-xs focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
            >
              <option value="">All Fee Tiers</option>
              <option value="0">Student Subsidized ($0)</option>
              <option value="10">Under $10 / slot</option>
              <option value="25">Under $25 / slot</option>
            </select>

            {(category !== 'all' || search || priceMax || availableDay) && (
              <button
                type="button"
                onClick={() => {
                  setCategory('all');
                  setSearch('');
                  setPriceMax('');
                  setAvailableDay('');
                }}
                className="text-[11px] font-semibold text-[#143828] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="text-stone-500 text-[11px] font-mono">
            Showing {services.length} of {pagination.total} records
          </div>
        </div>

        {/* State Handlers: Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-stone-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-20 bg-stone-200 rounded" />
                    <div className="h-5 w-3/4 bg-stone-200 rounded" />
                    <div className="h-3 w-1/2 bg-stone-200 rounded" />
                    <div className="h-3 w-full bg-stone-200 rounded" />
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between">
                  <div className="h-4 w-16 bg-stone-200 rounded" />
                  <div className="h-8 w-24 bg-stone-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-xl border border-rose-200 p-8 text-center max-w-lg mx-auto space-y-3">
            <div className="w-10 h-10 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Database Connection Required</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {error}
            </p>
            <p className="text-[11px] text-stone-500 font-mono bg-stone-50 p-2 rounded border border-stone-200">
              Ensure MONGODB_URI is set in .env and run: npm run seed
            </p>
            <button
              type="button"
              onClick={() => fetchServices(1)}
              className="px-4 py-2 bg-[#143828] hover:bg-[#1B4D36] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Fetch</span>
            </button>
          </div>
        ) : services.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800">No facilities match your criteria</h3>
            <p className="text-xs text-stone-500">
              Try choosing another category, price range, or clearing your search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSearch('');
                setPriceMax('');
                setAvailableDay('');
              }}
              className="text-xs font-bold text-[#143828] hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Service Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div
                key={svc._id}
                className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-stone-400 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Consistent Aspect Ratio */}
                  <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                    <img
                      src={svc.image}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

                    {/* Category & Fee Overlays */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-900/80 text-white backdrop-blur-xs font-mono">
                        {svc.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs font-mono ${
                        svc.price === 0
                          ? 'bg-[#143828] text-white'
                          : 'bg-white text-stone-900 border border-stone-200'
                      }`}>
                        {svc.price === 0 ? 'Free' : `$${svc.price} / slot`}
                      </span>
                    </div>

                    {/* Bottom Metadata inside Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{svc.averageRating ? svc.averageRating.toFixed(1) : '5.0'}</span>
                        <span className="text-stone-300 text-[10px] font-normal">
                          ({svc.totalRatings || 0})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-stone-200 text-xs font-medium">
                        <Users className="w-3.5 h-3.5 text-stone-300" />
                        <span>Max {svc.capacity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-extrabold text-base text-stone-900 group-hover:text-[#143828] transition leading-snug">
                      {svc.name}
                    </h3>

                    <p className="text-xs text-stone-500 flex items-center gap-1 truncate font-medium">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{svc.location}</span>
                    </p>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {svc.description}
                    </p>

                    {/* Operational Details */}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{svc.duration}m duration</span>
                      </span>
                      <span>
                        {svc.startTime} - {svc.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                  <Link
                    to={`/services/${svc._id}`}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 py-1.5 px-2 rounded-lg hover:bg-stone-100 transition"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedServiceForBooking(svc)}
                    className="px-4 py-2 bg-[#143828] hover:bg-[#1B4D36] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => fetchServices(pagination.page - 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold disabled:opacity-40 hover:bg-stone-50 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs text-stone-600 font-medium font-mono">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchServices(pagination.page + 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold disabled:opacity-40 hover:bg-stone-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onBookingSuccess={() => fetchServices(pagination.page)}
        />
      )}
    </div>
  );
}
