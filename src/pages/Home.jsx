import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 bg-indigo-100 rounded-full mb-4">
          MERN · JWT · NODEMAILER
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
          User Authentication
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            with real Email OTP
          </span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          A production-grade MERN authentication system: register with full profile, verify with a real OTP sent to your inbox, login with JWT, and reset forgotten passwords securely.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 shadow-lg shadow-indigo-200"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 shadow-lg shadow-indigo-200"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl border border-slate-200 hover:border-slate-300"
              >
                I already have an account
              </Link>
            </>
          )}
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-4">
          {[
            { icon: '📧', title: 'Real OTP emails', desc: 'Sent via Nodemailer + Gmail SMTP' },
            { icon: '🔒', title: 'Bcrypt + JWT', desc: 'Industry-standard security' },
            { icon: '🛡️', title: 'Protected routes', desc: 'Server + client side' },
          ].map((f) => (
            <div key={f.title} className="p-5 bg-white rounded-xl border border-slate-200 text-left">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold text-slate-900">{f.title}</div>
              <div className="text-sm text-slate-600 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
