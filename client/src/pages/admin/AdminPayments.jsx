import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Filter, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.admin.getAllPayments({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        page,
        limit: 15,
      });
      setPayments(res.payments || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Financial Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Campus Simulated Payment Audit
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            Complete transaction records stored in MongoDB Atlas with automated transaction IDs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-semibold">
          {['all', 'completed', 'pending', 'refunded'].map((st) => (
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
          <p className="text-xs text-stone-500 font-mono">Loading payment ledger...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <CreditCard className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No payment transactions found</h3>
          <p className="text-xs text-stone-500">
            No payments match the selected status filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-4 font-bold">Transaction ID</th>
                  <th className="py-3 px-4 font-bold">Student</th>
                  <th className="py-3 px-4 font-bold">Facility</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Method</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {p.transactionId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block">{p.user?.name || 'Student'}</span>
                      <span className="text-[10px] text-stone-400 font-mono block">{p.user?.email}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800">
                      {p.booking?.service?.name || 'Campus Facility'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      ${p.amount}.00
                    </td>
                    <td className="py-3 px-4 capitalize text-stone-600 font-mono text-[11px]">
                      {p.method ? p.method.replace('_', ' ') : 'Campus Card'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        p.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : p.status === 'refunded'
                          ? 'bg-stone-100 text-stone-700 border border-stone-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()}
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
                  onClick={() => fetchPayments(pagination.page - 1)}
                  className="px-3 py-1 rounded-md border border-stone-300 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchPayments(pagination.page + 1)}
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
