import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3,
  Layers,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';

const STATUS_COLORS = {
  pending: '#D97706',
  confirmed: '#143828',
  completed: '#44403C',
  cancelled: '#78716C',
  rejected: '#E11D48',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.admin.getDashboardStats();
        setStats(res.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-2">
        <div className="w-8 h-8 border-2 border-[#143828] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-mono">Loading operations dashboard...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              Operations Center
            </span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-[11px] font-mono text-emerald-800 font-bold">
              MongoDB Atlas Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Campus Operations & Resource Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            Real-time facility utilization, reservation queues, and bursar ledger telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/services"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold border border-stone-300 transition shadow-2xs"
          >
            Manage Facilities
          </Link>
          <Link
            to="/admin/bookings"
            className="px-4 py-2 bg-[#143828] hover:bg-[#1B4D36] text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            Review Bookings
          </Link>
        </div>
      </div>

      {/* Compact KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1.5 font-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider">Students Enrolled</span>
            <Users className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
            {stats.totalUsers || 0}
          </div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Active registered accounts</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1.5 font-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
            {stats.totalBookings || 0}
          </div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">All-time passes generated</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1.5 font-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {stats.pendingBookings || 0}
          </div>
          <span className="text-[11px] text-amber-800 mt-0.5 block font-semibold">Action required</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1.5 font-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider">Demo Bursar Total</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
            ${stats.totalRevenue || 0}
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-semibold">Simulated settlements</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bookings by Category */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#143828]" />
              <span>Utilization by Category</span>
            </h3>
            <span className="text-[10px] font-mono text-stone-400 uppercase">Bookings Count</span>
          </div>

          <div className="h-64 w-full pt-2">
            {stats.bookingsByCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.bookingsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3EFEA" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#78716C' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716C' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E7E5E4', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#143828" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                No category data available yet
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#143828]" />
            <span>Pass Status Distribution</span>
          </h3>

          <div className="space-y-3 pt-2">
            {stats.bookingsByStatus?.map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="capitalize font-semibold text-stone-700">{item.status}</span>
                  <span className="font-bold text-stone-900">{item.count} passes</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((item.count / (stats.totalBookings || 1)) * 100))}%`,
                      backgroundColor: STATUS_COLORS[item.status] || '#143828',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#143828]" />
            <span>Recent Activity Stream</span>
          </h3>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-[#143828] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Facility</th>
                <th className="py-2.5 px-3">Reserved Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stats.recentBookings?.map((b) => (
                <tr key={b._id} className="hover:bg-stone-50 transition">
                  <td className="py-3 px-3 font-semibold text-stone-900">
                    {b.user?.name || 'Student'}
                  </td>
                  <td className="py-3 px-3 text-stone-700 font-medium">{b.service?.name}</td>
                  <td className="py-3 px-3 text-stone-500 font-mono text-[11px]">
                    {new Date(b.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
