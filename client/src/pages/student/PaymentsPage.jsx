import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import api from '../../services/api.js';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.payments.getMyPayments();
        setPayments(res.payments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalSpent = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Bursar Office Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Campus Demo Payment & Settlement History
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            Record of simulated facility reservations, equipment loans, and departmental chargebacks in MongoDB Atlas.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 text-stone-800 border border-stone-200 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#143828]" />
          <span>Demo Wallet Active ($250.00 Credit)</span>
        </div>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
            Account Allocation
          </span>
          <div className="text-2xl font-black text-stone-900 font-mono my-1.5">
            $250.00 USD
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            Campus One-Card Demo Balance
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
            Total Demo Settled
          </span>
          <div className="text-2xl font-black text-stone-900 font-mono my-1.5">
            ${totalSpent}.00
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Across all completed passes</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
            Ledger Entries
          </span>
          <div className="text-2xl font-black text-stone-900 font-mono my-1.5">
            {payments.length}
          </div>
          <span className="text-[11px] text-stone-500">
            Logged in MongoDB transactions
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#143828] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-mono">Retrieving financial ledger...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Receipt className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No payment records found</h3>
          <p className="text-xs text-stone-500">
            When you reserve campus spaces requiring fees, simulated transaction receipts appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-4 font-bold">Transaction Ref</th>
                  <th className="py-3 px-4 font-bold">Facility</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Settlement Channel</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {p.transactionId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      {p.booking?.service?.name || 'Campus Facility'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      ${p.amount}.00
                    </td>
                    <td className="py-3 px-4 capitalize text-stone-600">
                      {p.method ? p.method.replace('_', ' ') : 'Campus Card'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          p.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : p.status === 'refunded'
                            ? 'bg-stone-100 text-stone-700 border border-stone-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleString()
                        : new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
