import React, { useState, useEffect } from 'react';
import { Users, Search, BookOpen, Calendar, DollarSign, X, Eye } from 'lucide-react';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [inspectedUser, setInspectedUser] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.admin.getUsers({
        search: search.trim() || undefined,
        page,
        limit: 12,
      });
      setUsers(res.users || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleInspect = async (id) => {
    setInspectLoading(true);
    try {
      const res = await api.admin.getUserDetails(id);
      setInspectedUser(res);
    } catch (err) {
      toast.error('Failed to load user details');
    } finally {
      setInspectLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Directory & Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Registered Student Accounts
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            Inspect individual student reservation activity, department affiliation, and simulated payments.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers(1)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#143828] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-mono">Loading student directory...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-4 font-bold">Student Name</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Department</th>
                  <th className="py-3 px-4 font-bold">Student ID</th>
                  <th className="py-3 px-4 font-bold">Joined</th>
                  <th className="py-3 px-4 font-bold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-bold text-stone-900">{u.name}</td>
                    <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-4 text-stone-600">{u.department || 'General'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{u.studentId || 'N/A'}</td>
                    <td className="py-3 px-4 text-stone-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleInspect(u._id)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-md text-xs border border-stone-300 transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
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
                Page {pagination.page} of {pagination.pages} ({pagination.total} students)
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchUsers(pagination.page - 1)}
                  className="px-3 py-1 rounded-md border border-stone-300 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchUsers(pagination.page + 1)}
                  className="px-3 py-1 rounded-md border border-stone-300 disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inspect User Modal */}
      {inspectedUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-stone-200 relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setInspectedUser(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-stone-500 block mb-0.5">
                  Student Account Dossier
                </span>
                <h3 className="text-xl font-extrabold text-stone-900">{inspectedUser.user.name}</h3>
                <p className="text-xs text-stone-500 font-mono">{inspectedUser.user.email} • ID: {inspectedUser.user.studentId || 'None'}</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 text-[10px] font-mono font-bold uppercase block">Total Bookings</span>
                  <span className="text-xl font-black text-stone-900 font-mono mt-0.5 block">
                    {inspectedUser.summary?.bookingCount || 0}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] font-mono font-bold uppercase block">Demo Fees Settled</span>
                  <span className="text-xl font-black text-emerald-800 font-mono mt-0.5 block">
                    ${inspectedUser.summary?.totalSpent || 0}
                  </span>
                </div>
              </div>

              {/* Recent Bookings List */}
              <div>
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 font-mono">
                  Reservation Activity ({inspectedUser.recentBookings?.length || 0})
                </h4>

                <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto">
                  {inspectedUser.recentBookings?.map((b) => (
                    <div key={b._id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block">{b.service?.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(b.date).toLocaleDateString()} • {b.startTime} - {b.endTime}
                        </span>
                      </div>
                      <StatusBadge status={b.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
