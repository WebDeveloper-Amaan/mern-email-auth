import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Real Email OTP',
    desc: 'Sent to your actual inbox via Nodemailer + Gmail SMTP',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Bcrypt + JWT',
    desc: 'Industry-standard password hashing with 12 salt rounds',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Protected Routes',
    desc: 'Server-side middleware + client-side route guards',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
];

const techStack = ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT', 'Nodemailer', 'bcrypt', 'Tailwind CSS'];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full shadow-sm">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            Production-Ready Authentication System
          </span>
        </div>

        {/* Hero heading */}
        <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Secure Auth
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              with Real OTP
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A full-stack MERN authentication system — register, verify your email with a real OTP, login with JWT, and reset passwords securely.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              Go to Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                Get started free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-all hover:-translate-y-0.5"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Tech stack pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.35s', opacity: 0 }}>
          {techStack.map((t) => (
            <span key={t} className="px-3 py-1 bg-white border border-slate-200 text-slate-500 text-xs font-medium rounded-full shadow-sm">
              {t}
            </span>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid sm:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card p-6 hover:-translate-y-1 transition-transform duration-200 animate-slide-up"
              style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} ${f.text} flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
