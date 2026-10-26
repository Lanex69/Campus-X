import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  Lock,
  Mail,
  Shield,
  User,
  ArrowRight,
  AlertCircle,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-lg bg-[#143828] text-[#D6EEE2] flex items-center justify-center font-bold text-sm tracking-wider shadow-xs mx-auto">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
            Sign In to Smart Campus
          </h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Access study rooms, compute clusters, athletic facilities, and passes.
          </p>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold text-stone-700 uppercase tracking-wider">
              Quick Test Accounts
            </span>
            <span className="text-[10px] text-stone-500">1-CLICK LOGIN</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('student@campus.edu', 'Student@123')}
              className="py-1.5 px-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-lg font-semibold transition text-[11px] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-stone-600" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@smartcampus.edu', 'Admin@123456')}
              className="py-1.5 px-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold transition text-[11px] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dean Admin</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              University Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143828] focus:border-[#143828] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143828] focus:border-[#143828] font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#143828] hover:bg-[#1B4D36] disabled:bg-stone-300 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-stone-600">
          New student?{' '}
          <Link to="/register" className="font-bold text-[#143828] hover:underline">
            Register Student Account
          </Link>
        </p>
      </div>
    </div>
  );
}
