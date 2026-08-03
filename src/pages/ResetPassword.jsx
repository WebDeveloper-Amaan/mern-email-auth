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
  const [showPass, setShowPass] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(form.otp)) return toast.error('OTP must be 6 digits');
    if (form.newPassword.length < 6) return toast.error('Password too short');
    if (form.newPassword !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email: form.email, otp: form.otp, newPassword: form.newPassword,
      });
      toast.success(data.message);
      navigate('/login');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) => open
    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card p-8">
          {/* Icon */}
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="text-slate-500 text-sm mt-1.5">Enter the OTP we emailed and choose a new password.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input type="email" name="email" value={form.email} onChange={onChange}
                placeholder="you@example.com" required className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">6-digit OTP</label>
              <input name="otp" value={form.otp} onChange={onChange}
                placeholder="• • • • • •" maxLength={6} inputMode="numeric"
                className="input-field tracking-[0.5em] text-center font-mono text-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="newPassword" value={form.newPassword} onChange={onChange}
                  placeholder="Min 6 characters" className="input-field pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="confirm" value={form.confirm} onChange={onChange}
                  placeholder="Repeat password" className="input-field pr-11" />
                {form.confirm && (
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${form.newPassword === form.confirm ? 'text-emerald-500' : 'text-red-400'}`}>
                    {form.newPassword === form.confirm
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    }
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Resetting…
                </span>
              ) : 'Reset Password'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Back to{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
