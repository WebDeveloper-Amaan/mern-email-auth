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

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

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
    if (otp.length !== 6) return toast.error('Enter 6 digits');

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
      toast.success('New OTP sent');
      setCooldown(30);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center">
      <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 grid place-items-center text-2xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-center text-slate-900">Check your email</h1>
        <p className="text-center text-slate-600 mt-1 text-sm">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        <form onSubmit={onSubmit} className="mt-6">
          <div className="flex gap-2 justify-center" onPaste={onPaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                value={d}
                onChange={(e) => onChange(i, e.target.value)}
                onKeyDown={(e) => onKey(i, e)}
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Didn't get it?{' '}
          {cooldown > 0 ? (
            <span className="text-slate-400">Resend in {cooldown}s</span>
          ) : (
            <button
              onClick={onResend}
              disabled={resending}
              className="text-indigo-600 font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
