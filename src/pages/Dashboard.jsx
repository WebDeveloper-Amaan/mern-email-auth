import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'profile', icon: '👤', label: 'Profile' },
  { id: 'security', icon: '🔒', label: 'Security' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const memberDays = Math.floor(
    (Date.now() - new Date(user.createdAt)) / 86400000
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-700">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            MERN Auth
          </span>
        </div>

        {/* Avatar */}
        <div className="px-6 py-5 border-b border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 grid place-items-center font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-slate-500 hover:text-slate-900"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold text-slate-800 capitalize">{active}</h1>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full">
            ✅ Verified
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {active === 'overview' && <Overview user={user} memberDays={memberDays} initials={initials} />}
          {active === 'profile' && <Profile user={user} />}
          {active === 'security' && <Security />}
        </main>
      </div>
    </div>
  );
}

/* ── Overview Tab ── */
function Overview({ user, memberDays, initials }) {
  const stats = [
    { label: 'Member For', value: `${memberDays}d`, icon: '📅', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Account Status', value: 'Active', icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Auth Method', value: 'JWT + OTP', icon: '🔑', color: 'bg-violet-50 text-violet-600' },
    { label: 'Password', value: 'Bcrypt x12', icon: '🛡️', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-white/20 grid place-items-center text-2xl font-bold border-2 border-white/30 shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-indigo-200 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-indigo-200 text-sm mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-lg grid place-items-center text-xl mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Quick Info</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['📱 Mobile', user.mobile],
            ['⚧ Gender', user.gender],
            ['🗺️ State', user.state],
            ['📮 Pin Code', user.pinCode],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-500 w-28 shrink-0">{label}</span>
              <span className="text-sm font-medium text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Profile Tab ── */
function Profile({ user }) {
  const fields = [
    { label: 'Full Name', value: user.name, icon: '👤' },
    { label: 'Email Address', value: user.email, icon: '📧' },
    { label: 'Mobile Number', value: user.mobile, icon: '📱' },
    { label: 'Gender', value: user.gender, icon: '⚧' },
    { label: 'State', value: user.state, icon: '🗺️' },
    { label: 'Pin Code', value: user.pinCode, icon: '📮' },
    { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: '📅' },
    { label: 'Verification', value: user.isVerified ? 'Verified ✅' : 'Unverified ⚠️', icon: '🔖' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-semibold text-slate-800 mb-5">Profile Details</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
              {f.icon} {f.label}
            </p>
            <p className="text-slate-800 font-semibold">{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Security Tab ── */
function Security() {
  const items = [
    { title: 'Password Hashing', desc: 'bcrypt with 12 salt rounds', status: 'Active', icon: '🔐' },
    { title: 'OTP Verification', desc: 'SHA-256 hashed, expires in 10 min', status: 'Active', icon: '📩' },
    { title: 'JWT Auth', desc: 'HS256 signed, 7-day expiry', status: 'Active', icon: '🎟️' },
    { title: 'Brute Force Guard', desc: 'Max 5 wrong OTP attempts', status: 'Active', icon: '🛡️' },
    { title: 'OTP TTL', desc: 'MongoDB auto-deletes expired OTPs', status: 'Active', icon: '⏱️' },
    { title: 'Enumeration Guard', desc: 'Generic response on forgot-password', status: 'Active', icon: '🕵️' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm font-medium">
        🎉 All security features are active and protecting your account.
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-5">Security Features</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
