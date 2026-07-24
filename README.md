# 🔐 MERN Auth System with Real Email OTP

A complete, production-ready User Authentication System built with the MERN stack. Features **real OTP emails** sent via Nodemailer + Gmail SMTP, JWT auth, bcrypt password hashing, and protected routes.

## ✨ Features

- ✅ Register with: Name, Email, Password, Mobile, Gender, State, Pin Code
- ✅ **Real Email OTP** verification (sent to actual inbox via Gmail SMTP)
- ✅ JWT-based login with bcrypt password hashing
- ✅ Protected routes (frontend + backend middleware)
- ✅ Forgot password → OTP → reset flow
- ✅ Resend OTP with cooldown
- ✅ TTL auto-delete of expired OTPs in MongoDB
- ✅ Hashed OTP storage (SHA-256) — leak-safe
- ✅ Brute-force protection (max 5 attempts)
- ✅ Email-enumeration protection on forgot-password

---

## 🎬 Demo Video

> 📺 **[Watch Full Demo on YouTube](#)** ← *(Replace with your YouTube link after recording)*

The demo covers:
- ✅ Complete registration with real OTP email delivery
- ✅ Email verification flow
- ✅ Login and dashboard walkthrough
- ✅ Forgot password → OTP → reset flow
- ✅ Live hosted version on Vercel + Render

> **Note:** Email OTP works perfectly in local development with Gmail SMTP.
> On free hosting (Render), SMTP ports are blocked by the platform.
> This is a known free-tier limitation — not a code issue.
> The full working demo is shown in the video above. 🎥

---

## 📁 Project Structure

```
mern-auth/
├── backend/                      # Express + MongoDB + Nodemailer
│   ├── config/db.js
│   ├── models/
│   │   ├── User.js              # Bcrypt hashing in pre-save hook
│   │   └── Otp.js               # TTL index, hashed OTPs
│   ├── controllers/
│   │   ├── authController.js    # register, verifyOtp, login, forgot, reset
│   │   └── userController.js    # protected /me
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT protect
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── generateOtp.js       # crypto.randomInt + SHA-256 hash
│   │   ├── sendEmail.js         # Nodemailer transporter + template
│   │   └── generateToken.js     # JWT helper
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── (frontend at project root)    # React + Vite + Tailwind
    ├── src/
    │   ├── api/axios.js          # Axios instance with JWT interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Register.jsx
    │   │   ├── VerifyOtp.jsx     # 6-box OTP input + paste support
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   └── ResetPassword.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── .env.example
```

---

## 🚀 Setup — Step by Step

### 1️⃣ Prerequisites

- Node.js 18+
- MongoDB Atlas account (free) → https://cloud.mongodb.com
- Gmail account with **2-Step Verification enabled**

### 2️⃣ Get a Gmail App Password (for sending emails)

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to https://myaccount.google.com/apppasswords
4. Create a new App Password → name it "MERN Auth"
5. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`) — remove spaces when pasting

### 3️⃣ Get a MongoDB Atlas connection string

1. Sign up at https://cloud.mongodb.com
2. Create a **free M0 cluster**
3. Database Access → add a user (username + password)
4. Network Access → add IP `0.0.0.0/0` (allow all, for dev)
5. Connect → "Drivers" → copy the connection string
6. Replace `<password>` and add `/mern_auth` before the `?`

### 4️⃣ Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Now edit .env with your MongoDB URI, JWT secret, and Gmail credentials
npm run dev
```

You should see:
```
✅ MongoDB connected: ...
✅ SMTP server ready to send emails
✅ Server running on http://localhost:5000
```

### 5️⃣ Frontend setup

In a **new terminal**, from the project root:

```bash
npm install
cp .env.example .env.local   # default API URL is fine
npm run dev
```

Open http://localhost:5173 → register with **your real email** → check your inbox for the OTP! 📬

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | `{ name, email, password, mobile, gender, state, pinCode }` | Create user + send OTP |
| POST | `/auth/verify-otp` | `{ email, otp }` | Verify OTP → returns JWT |
| POST | `/auth/resend-otp` | `{ email, purpose }` | Resend OTP |
| POST | `/auth/login` | `{ email, password }` | Login → returns JWT |
| POST | `/auth/forgot-password` | `{ email }` | Send reset OTP |
| POST | `/auth/reset-password` | `{ email, otp, newPassword }` | Reset password |
| GET | `/users/me` | _(JWT in header)_ | Get current user |

JWT must be sent as: `Authorization: Bearer <token>`

---

## 🔒 Security Features

| Practice | Implementation |
|----------|---------------|
| Password hashing | bcrypt (12 rounds) in `User` pre-save hook |
| OTP storage | SHA-256 hashed before saving — DB leak safe |
| OTP generation | `crypto.randomInt()` (cryptographically secure) |
| OTP expiry | MongoDB TTL index auto-deletes after 10 min |
| Brute force | Max 5 wrong attempts → OTP invalidated |
| JWT | HS256, 7-day expiry, secret in env |
| User enumeration | Generic response on `/forgot-password` |
| CORS | Restricted to frontend origin |
| Password select | `select: false` — never returned by default |

---

## 🌐 Deployment

### Backend → Render

1. Push to GitHub
2. Render → New Web Service → connect repo
3. Root: `backend/` · Build: `npm install` · Start: `npm start`
4. Add all env vars from `.env`
5. Update `CLIENT_URL` to your Vercel URL

### Frontend → Vercel

1. Vercel → Import GitHub repo
2. Framework: Vite · Root: `/` (project root)
3. Add env: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Database → MongoDB Atlas

Already cloud-hosted from setup step 3.

---

## 🧪 Testing the Flow

1. Register at http://localhost:5173/register with your real email
2. Check your inbox (or spam) — you'll receive a styled OTP email
3. Enter the 6-digit code on the verify page
4. Land on the dashboard with your full profile
5. Logout, then test forgot-password flow

---

## 📝 License

MIT — use freely for learning, college projects, and portfolios.
