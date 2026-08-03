import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Icons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  key: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  phone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  location: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  pin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    </svg>
  ),
  gender: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9m-3-3h6" />
    </svg>
  ),
};

const NAV = [
  { id: 'overview', icon: Icons.home, label: 'Overview' },
  { id: 'profile', icon: Icons.user, label: 'Profile' },
  { id: 'security', icon: Icons.shield, label: 'Security' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const memberDays = Math.floor((Date.now() - new Date(user.createdAt)) / 86400000);

  return (
    <div className="flex flex-1 min-h-0 bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300
          bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white shadow-2xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              MERN Auth
            </span>
          </div>
        </div>

        {/* Avatar */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 grid place-items-center font-bold text-sm shrink-0 shadow-lg ring-2 ring-white/20">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate text-white">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${active === item.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:bg-white/8 hover:text-white'}`}
            >
              {item.icon}
              {item.label}
              {active === item.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            {Icons.logout}
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white/70 backdrop-blur-md border-b border-white/50 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-500 hover:text-slate-900 transition-colors" onClick={() => setSidebarOpen(true)}>
              {Icons.menu}
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800 capitalize">{active}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {active === 'overview' ? 'Your account at a glance' : active === 'profile' ? 'Your personal information' : 'Security & protection status'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Verified
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
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
    { label: 'Member For', value: `${memberDays}d`, icon: Icons.calendar, from: 'from-indigo-500', to: 'to-indigo-600', light: 'bg-indigo-50 text-indigo-600' },
    { label: 'Account Status', value: 'Active', icon: Icons.check, from: 'from-emerald-500', to: 'to-emerald-600', light: 'bg-emerald-50 text-emerald-600' },
    { label: 'Auth Method', value: 'JWT + OTP', icon: Icons.key, from: 'from-violet-500', to: 'to-violet-600', light: 'bg-violet-50 text-violet-600' },
    { label: 'Password', value: 'Bcrypt ×12', icon: Icons.shield, from: 'from-amber-500', to: 'to-amber-600', light: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-7 text-white shadow-xl shadow-indigo-500/20">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-violet-500/20 blur-2xl" />

        <div className="relative flex items-center gap-5">
          <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-white/15 backdrop-blur-sm grid place-items-center text-2xl font-bold border border-white/25 shadow-inner shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-indigo-200 text-sm font-medium">Welcome back 👋</p>
            <h2 className="text-2xl font-bold mt-0.5 truncate">{user.name}</h2>
            <p className="text-indigo-300 text-sm mt-1 truncate">{user.email}</p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs text-indigo-300">Joined</span>
            <span className="text-sm font-semibold">
              {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.from} ${s.to} grid place-items-center text-white mb-4 shadow-md`}>
              {s.icon}
            </div>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick info */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 inline-block" />
          Quick Info
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            [Icons.phone, 'Mobile', user.mobile],
            [Icons.gender, 'Gender', user.gender],
            [Icons.location, 'State', user.state],
            [Icons.pin, 'Pin Code', user.pinCode],
          ].map(([icon, label, value]) => (
            <div key={label} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors duration-150">
              <span className="text-indigo-500 shrink-0">{icon}</span>
              <span className="text-sm text-slate-500 w-20 shrink-0">{label}</span>
              <span className="text-sm font-semibold text-slate-800 truncate">{value}</span>
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
    { label: 'Full Name', value: user.name, icon: Icons.user },
    { label: 'Email Address', value: user.email, icon: Icons.mail },
    { label: 'Mobile Number', value: user.mobile, icon: Icons.phone },
    { label: 'Gender', value: user.gender, icon: Icons.gender },
    { label: 'State', value: user.state, icon: Icons.location },
    { label: 'Pin Code', value: user.pinCode, icon: Icons.pin },
    {
      label: 'Member Since',
      value: new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      icon: Icons.calendar,
    },
    {
      label: 'Verification',
      value: user.isVerified ? 'Verified' : 'Unverified',
      icon: Icons.check,
      badge: user.isVerified ? 'emerald' : 'amber',
    },
  ];

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-white text-xl font-bold shadow-lg shrink-0">
          {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active Account
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 inline-block" />
          Profile Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.label} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors duration-150">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <span className="text-indigo-400">{f.icon}</span>
                <p className="text-xs font-semibold uppercase tracking-wider">{f.label}</p>
              </div>
              {f.badge ? (
                <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-2.5 py-0.5 rounded-full
                  ${f.badge === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${f.badge === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {f.value}
                </span>
              ) : (
                <p className="text-slate-800 font-semibold text-sm">{f.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Security Tab ── */
function Security() {
  const items = [
    { title: 'Password Hashing', desc: 'bcrypt with 12 salt rounds', icon: Icons.key, color: 'indigo' },
    { title: 'OTP Verification', desc: 'SHA-256 hashed, expires in 10 min', icon: Icons.mail, color: 'violet' },
    { title: 'JWT Auth', desc: 'HS256 signed, 7-day expiry', icon: Icons.shield, color: 'blue' },
    { title: 'Brute Force Guard', desc: 'Max 5 wrong OTP attempts', icon: Icons.shield, color: 'rose' },
    { title: 'OTP TTL', desc: 'MongoDB auto-deletes expired OTPs', icon: Icons.calendar, color: 'amber' },
    { title: 'Enumeration Guard', desc: 'Generic response on forgot-password', icon: Icons.user, color: 'emerald' },
  ];

  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-200',
    violet: 'from-violet-500 to-violet-600 shadow-violet-200',
    blue: 'from-blue-500 to-blue-600 shadow-blue-200',
    rose: 'from-rose-500 to-rose-600 shadow-rose-200',
    amber: 'from-amber-500 to-amber-600 shadow-amber-200',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
  };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white shadow-lg shadow-emerald-500/20">
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center shrink-0">
            {Icons.shield}
          </div>
          <div>
            <p className="font-bold text-base">All Systems Secure</p>
            <p className="text-emerald-100 text-sm mt-0.5">6 security features are active and protecting your account.</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 text-xs font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Security items */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500 inline-block" />
          Security Features
        </h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-150 group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[item.color]} grid place-items-center text-white shadow-md shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
