import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building,
} from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState('campus_card');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!booking) return null;

  const amount =
    booking.payment?.amount ||
    (booking.service?.price || 0) * (booking.numberOfPeople || 1);

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg('');

    try {
      const res = await api.payments.processPayment(booking._id, { method });
      toast.success('Demo settlement completed! Pass updated.');
      if (onPaymentSuccess) onPaymentSuccess(res.payment);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Payment simulation failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-stone-200 relative my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="text-[10px] font-mono uppercase font-bold text-stone-500 tracking-wider block mb-1">
            Bursar Office Settlement
          </span>
          <h3 className="text-xl font-extrabold text-stone-900">Campus Fee Checkout</h3>
          <p className="text-xs text-stone-500 mt-0.5">{booking.service?.name}</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Educational Simulation Notice */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600 space-y-1 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-stone-900">
            <ShieldCheck className="w-4 h-4 text-[#143828]" />
            <span className="text-[11px] uppercase tracking-wider font-mono">Simulated Campus Ledger</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-500">
            Demonstration transaction recorded in MongoDB Atlas. No real bank cards, CVVs, or currency are requested, charged, or stored.
          </p>
        </div>

        {/* Itemized Fee Breakdown */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-stone-200 space-y-1.5 mb-4 text-xs">
          <div className="flex items-center justify-between text-stone-600">
            <span>Facility Rate ({booking.numberOfPeople || 1} participant(s))</span>
            <span className="font-mono font-semibold">${amount}.00</span>
          </div>
          <div className="flex items-center justify-between text-stone-600">
            <span>Student Subsidy Credit</span>
            <span className="font-mono font-semibold text-emerald-700">-$0.00</span>
          </div>
          <div className="border-t border-stone-200 pt-1.5 flex items-center justify-between text-sm font-bold text-stone-900">
            <span>Total Demo Charge:</span>
            <span className="font-mono font-black text-stone-900">${amount}.00</span>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select Demo Payment Method
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                  method === 'campus_card'
                    ? 'border-[#143828] bg-stone-50 text-stone-950 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="method"
                    value="campus_card"
                    checked={method === 'campus_card'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="text-[#143828]"
                  />
                  <span>Campus One-Card Account (Student ID)</span>
                </div>
                <CreditCard className="w-4 h-4 text-stone-400" />
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                  method === 'student_account'
                    ? 'border-[#143828] bg-stone-50 text-stone-950 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="method"
                    value="student_account"
                    checked={method === 'student_account'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="text-[#143828]"
                  />
                  <span>Departmental Lab Account / Grant</span>
                </div>
                <Building className="w-4 h-4 text-stone-400" />
              </label>
            </div>
          </div>

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
              disabled={processing}
              className="px-5 py-2.5 rounded-lg bg-[#143828] hover:bg-[#1B4D36] disabled:bg-stone-300 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              {processing ? 'Processing Settlement...' : `Confirm Demo Payment ($${amount})`}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
