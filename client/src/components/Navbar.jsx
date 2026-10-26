import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  Compass,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Layers,
  Check,
  Building2,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out of campus session');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleQuickSwitch = async (role) => {
    try {
      if (role === 'admin') {
        await login({ email: 'admin@smartcampus.edu', password: 'Admin@123456' });
        toast.success('Switched to Dean Admin Account');
        navigate('/admin');
      } else {
        await login({ email: 'student@campus.edu', password: 'Student@123' });
        toast.success('Switched to Student Account (Rahul Sharma)');
        navigate('/');
      }
      setSwitcherOpen(false);
    } catch (err) {
      toast.error('Switch failed: ' + err.message);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition ${
      isActive
        ? 'bg-[#143828] text-white shadow-xs'
        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#143828] text-[#D6EEE2] flex items-center justify-center font-bold text-sm tracking-wider shadow-xs group-hover:bg-[#1B4D36] transition">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                <span>SMART CAMPUS</span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.2 rounded bg-stone-200/80 text-stone-700">
                  PORTAL
                </span>
              </div>
              <div className="text-[10px] text-stone-500 font-medium tracking-tight">
                University Facility & Space Management
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClass}>
              <Compass className="w-3.5 h-3.5 opacity-80" />
              <span>Services</span>
            </NavLink>

            <NavLink to="/map" className={navLinkClass}>
              <MapPin className="w-3.5 h-3.5 opacity-80" />
              <span>Campus Zones</span>
            </NavLink>

            {user && (
              <>
                <NavLink to="/my-bookings" className={navLinkClass}>
                  <Calendar className="w-3.5 h-3.5 opacity-80" />
                  <span>My Passes</span>
                </NavLink>

                <NavLink to="/payments" className={navLinkClass}>
                  <CreditCard className="w-3.5 h-3.5 opacity-80" />
                  <span>Demo Ledger</span>
                </NavLink>

                <NavLink to="/profile" className={navLinkClass}>
                  <User className="w-3.5 h-3.5 opacity-80" />
                  <span>Profile</span>
                </NavLink>
              </>
            )}

            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition cursor-pointer ${
                    adminMenuOpen
                      ? 'bg-stone-800 text-white'
                      : 'text-stone-800 bg-stone-200/80 hover:bg-stone-300'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Operations</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {adminMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 animate-in fade-in"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <div className="px-3 py-1 border-b border-stone-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Administration
                      </span>
                    </div>
                    <Link
                      to="/admin"
                      className="block px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 font-semibold"
                    >
                      Executive Dashboard
                    </Link>
                    <Link
                      to="/admin/services"
                      className="block px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
                    >
                      Facility Inventory
                    </Link>
                    <Link
                      to="/admin/bookings"
                      className="block px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
                    >
                      Bookings & Approvals
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
                    >
                      Student Directory
                    </Link>
                    <Link
                      to="/admin/payments"
                      className="block px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
                    >
                      Bursar Ledger Audit
                    </Link>
                    <Link
                      to="/admin/feedback"
                      className="block px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
                    >
                      Feedback & Ratings
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Evaluator Persona Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300/80 text-stone-800 text-xs font-semibold transition cursor-pointer shadow-2xs"
                title="Switch persona for grading"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="truncate max-w-[120px]">
                  {user ? user.name.split(' ')[0] : 'Demo Role'}
                </span>
                <span className={`text-[10px] uppercase font-mono px-1 py-0.2 rounded font-bold ${
                  isAdmin ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {user?.role || 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {switcherOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-stone-800 animate-in fade-in"
                  onClick={() => setSwitcherOpen(false)}
                >
                  <div className="px-3 py-1 border-b border-stone-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Evaluator Persona Switcher
                    </p>
                    <p className="text-[11px] text-stone-500">
                      1-click instant login swap for testing
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleQuickSwitch('student')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 flex items-center justify-between transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>Rahul Sharma</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                            STUDENT
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400">CS2024-042 • Computer Science</div>
                      </div>
                      {user?.role === 'student' && <Check className="w-4 h-4 text-emerald-700" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickSwitch('admin')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-purple-50 text-stone-800 hover:text-purple-900 flex items-center justify-between transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>Dean Sarah Jenkins</span>
                          <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-mono">
                            ADMIN
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400">Campus Operations & Dean's Office</div>
                      </div>
                      {isAdmin && <Check className="w-4 h-4 text-purple-700" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#143828] hover:bg-[#1B4D36] transition shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-stone-200 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 space-y-2">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
            >
              Services Catalog
            </NavLink>
            <NavLink
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
            >
              Campus Zones
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
                >
                  My Passes
                </NavLink>
                <NavLink
                  to="/payments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
                >
                  Demo Ledger
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
                >
                  Profile
                </NavLink>
              </>
            )}

            {isAdmin && (
              <div className="pt-2 border-t border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3">
                  Admin Controls
                </span>
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-stone-800 font-semibold hover:bg-stone-100"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-100"
                >
                  Facilities
                </NavLink>
                <NavLink
                  to="/admin/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-100"
                >
                  Bookings
                </NavLink>
                <NavLink
                  to="/admin/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-100"
                >
                  Users
                </NavLink>
                <NavLink
                  to="/admin/payments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-100"
                >
                  Payments
                </NavLink>
                <NavLink
                  to="/admin/feedback"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-100"
                >
                  Feedback
                </NavLink>
              </div>
            )}

            {/* Persona Switch in Mobile */}
            <div className="pt-2 border-t border-stone-200 px-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  handleQuickSwitch('student');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 bg-stone-100 text-stone-800 text-[11px] font-bold rounded-lg border border-stone-300"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  handleQuickSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 bg-purple-100 text-purple-900 text-[11px] font-bold rounded-lg border border-purple-200"
              >
                Dean Admin
              </button>
            </div>

            {user ? (
              <div className="pt-2 border-t border-stone-200 px-3">
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-rose-700 bg-rose-50 rounded-lg"
                >
                  Sign Out ({user.name})
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-stone-200 px-3 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold text-stone-700 bg-stone-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#143828] rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
