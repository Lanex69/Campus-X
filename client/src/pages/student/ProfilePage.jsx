import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  User,
  Mail,
  Hash,
  BookOpen,
  Phone,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateProfile({ name, department, studentId, phone });
      toast.success('Academic profile saved');
    } catch (err) {
      toast.error(err.message || 'Profile update failed');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setUpdatingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Password update failed');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-[#143828] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">{user.name}</h1>
              <span
                className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-900 border border-purple-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                {user.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
              {user.department || 'General Division'} • Matriculation ID: {user.studentId || 'N/A'}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-stone-500 border border-stone-200 px-3 py-1.5 rounded-lg bg-stone-50">
          Account Status: <strong className="text-emerald-800">Verified Active</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <User className="w-4 h-4 text-[#143828]" />
            <span>Academic Profile</span>
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Legal Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Academic Department
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science & Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Student ID / Roll Number
              </label>
              <input
                type="text"
                placeholder="e.g. CS2024-042"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Phone Contact
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full py-2.5 rounded-lg bg-[#143828] hover:bg-[#1B4D36] text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#143828]" />
            <span>Security & Password</span>
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                New Password (Min 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full py-2.5 rounded-lg bg-[#143828] hover:bg-[#1B4D36] text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
