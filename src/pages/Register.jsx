import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
];

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', mobile: '', gender: '', state: '', pinCode: '',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Invalid mobile (10 digits, starts with 6-9)';
    if (!form.gender) return 'Select gender';
    if (!form.state) return 'Select state';
    if (!/^\d{6}$/.test(form.pinCode)) return 'Pin code must be 6 digits';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      toast.success(data.message || 'OTP sent to your email');
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
        <p className="text-slate-600 mt-1">We'll email you an OTP to verify it's you.</p>

        <form onSubmit={onSubmit} className="mt-6 grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" name="name" value={form.name} onChange={onChange} placeholder="Jane Doe" />
          <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} placeholder="jane@example.com" />
          <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Min 6 chars" />
          <Field label="Mobile" name="mobile" value={form.mobile} onChange={onChange} placeholder="9876543210" maxLength={10} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={onChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
              <option value="">Select</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
            <select name="state" value={form.state} onChange={onChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
              <option value="">Select</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <Field label="Pin Code" name="pinCode" value={form.pinCode} onChange={onChange} placeholder="560001" maxLength={6} />

          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 mt-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 shadow-lg shadow-indigo-200"
          >
            {loading ? 'Sending OTP…' : 'Register & Send OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
      />
    </div>
  );
}
