import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = location.state?.email || '';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const inputs = useRef([]);

  useEffect(() => { if (!email) navigate('/register'); }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const onPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      e.preventDefault();
      setDigits(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) return toast.error('Enter all 6 digits');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      login(data.token, data.user);
      toast.success('Email verified! 🎉');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Verification failed');
      setDigits(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-otp', { email, purpose: 'register' });
      toast.success('New OTP sent to your inbox');
      setCooldown(30);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not resend');
    } finally {
      setResending(false);
    }
  };

  const filled = digits.filter(Boolean).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Check your inbox</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            We sent a 6-digit verification code to<br />
            <span className="font-semibold text-slate-700">{email}</span>
          </p>

          {/* Progress bar */}
          <div className="mt-5 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${(filled / 6) * 100}%` }}
            />
          </div>

          <form onSubmit={onSubmit} className="mt-6">
            {/* OTP boxes */}
            <div className="flex gap-2.5 justify-center" onPaste={onPaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={d}
                  onChange={(e) => onChange(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
                    ${d
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100'
                      : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-400 focus:bg-indigo-50/50 focus:shadow-md focus:shadow-indigo-100'
                    }`}
                />
              ))}
            </div>

            <button type="submit" disabled={loading || filled < 6} className="btn-primary mt-6">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying…
                </span>
              ) : 'Verify Email'}
            </button>
          </form>

          <div className="mt-5 text-sm text-slate-500">
            Didn't receive it?{' '}
            {cooldown > 0 ? (
              <span className="text-slate-400">
                Resend in <span className="font-semibold text-slate-600">{cooldown}s</span>
              </span>
            ) : (
              <button
                onClick={onResend}
                disabled={resending}
                className="text-indigo-600 font-semibold hover:text-indigo-700 disabled:opacity-50"
              >
                {resending ? 'Sending…' : 'Resend OTP'}
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-400">Check your spam folder if you don't see it</p>
        </div>
      </div>
    </div>
  );
}
