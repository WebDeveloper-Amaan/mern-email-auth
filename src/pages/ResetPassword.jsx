import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(form.otp)) return toast.error('OTP must be 6 digits');
    if (form.newPassword.length < 6) return toast.error('Password too short');
    if (form.newPassword !== form.confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success(data.message);
      navigate('/login');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center">
      <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
        <p className="text-slate-600 mt-1 text-sm">Enter the OTP we emailed and your new password.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="email" name="email" value={form.email} onChange={onChange}
            placeholder="Email" required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          />
          <input
            name="otp" value={form.otp} onChange={onChange}
            placeholder="6-digit OTP" maxLength={6} inputMode="numeric"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none tracking-widest text-center font-mono"
          />
          <input
            type="password" name="newPassword" value={form.newPassword} onChange={onChange}
            placeholder="New password (min 6 chars)"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          />
          <input
            type="password" name="confirm" value={form.confirm} onChange={onChange}
            placeholder="Confirm new password"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          />
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Back to <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
