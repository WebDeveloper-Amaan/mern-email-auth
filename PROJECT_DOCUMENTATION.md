# 🔐 MERN Email OTP Authentication System - Complete Project Documentation

**Developer:** Amaan Ahmed  
**Tech Stack:** MongoDB, Express.js, React.js, Node.js (MERN)  
**Live Demo:** https://mern-email-auth.vercel.app  
**Backend API:** https://mern-auth-backend-h94t.onrender.com

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Security Implementation](#security-implementation)
8. [Frontend Structure](#frontend-structure)
9. [Backend Structure](#backend-structure)
10. [Authentication Flow](#authentication-flow)
11. [Deployment Process](#deployment-process)
12. [Environment Variables](#environment-variables)
13. [Testing Guide](#testing-guide)
14. [Challenges & Solutions](#challenges--solutions)
15. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

This is a **production-ready authentication system** that implements secure user registration and login using **real email OTP verification**. Unlike basic auth systems that use fake OTPs or skip email verification, this project sends actual OTP codes to users' email inboxes using Gmail SMTP.

### Purpose
- Provide a complete, secure authentication solution for web applications
- Demonstrate best practices in user authentication and security
- Serve as a portfolio project showcasing full-stack development skills

### Problem It Solves
- Eliminates fake/bot registrations through email verification
- Provides secure password reset mechanism
- Implements industry-standard security practices (bcrypt, JWT, hashed OTPs)

---

## ✨ Key Features

### User Management
- ✅ **User Registration** with comprehensive profile fields (name, email, password, mobile, gender, state, pin code)
- ✅ **Email OTP Verification** - Real emails sent to user's inbox via Gmail SMTP
- ✅ **Secure Login** with JWT token-based authentication
- ✅ **Forgot Password** flow with OTP verification
- ✅ **Password Reset** functionality
- ✅ **User Dashboard** with profile information and security status

### Security Features
- ✅ **Password Hashing** - bcrypt with 12 salt rounds
- ✅ **OTP Hashing** - SHA-256 hashed before database storage
- ✅ **JWT Authentication** - HS256 signed tokens with 7-day expiry
- ✅ **Brute Force Protection** - Max 5 wrong OTP attempts
- ✅ **OTP Expiry** - MongoDB TTL index auto-deletes after 10 minutes
- ✅ **Email Enumeration Protection** - Generic responses on forgot-password
- ✅ **CORS Protection** - Restricted to frontend origin only
- ✅ **Protected Routes** - Both frontend and backend middleware

### User Experience
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Modern UI** - Built with Tailwind CSS
- ✅ **Real-time Validation** - Form validation with error messages
- ✅ **Toast Notifications** - User-friendly success/error messages
- ✅ **Resend OTP** - With cooldown timer to prevent spam
- ✅ **6-Box OTP Input** - Professional OTP entry with paste support

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.3** - UI library for building interactive interfaces
- **Vite 7.3.2** - Fast build tool and dev server
- **React Router DOM 7.14.1** - Client-side routing
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Axios 1.15.0** - HTTP client for API requests
- **React Hot Toast 2.6.0** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.19.2** - Web application framework
- **MongoDB (Mongoose 8.5.1)** - NoSQL database with ODM
- **Nodemailer 6.9.14** - Email sending library
- **bcryptjs 2.4.3** - Password hashing
- **jsonwebtoken 9.0.2** - JWT token generation/verification
- **dotenv 16.4.5** - Environment variable management
- **cors 2.8.5** - Cross-origin resource sharing

### Deployment
- **Frontend:** Vercel (Free tier)
- **Backend:** Render (Free tier)
- **Database:** MongoDB Atlas (Free M0 cluster)
- **Email Service:** Gmail SMTP (Free)

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   User Browser  │
│   (React App)   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Vercel CDN     │
│  (Frontend)     │
└────────┬────────┘
         │ API Calls (Axios)
         ▼
┌─────────────────┐      ┌──────────────┐
│  Render Server  │◄────►│ MongoDB      │
│  (Backend API)  │      │ Atlas        │
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│  Gmail SMTP     │
│  (Email OTP)    │
└─────────────────┘
```

### Request Flow
1. User interacts with React frontend (Vercel)
2. Frontend sends API request via Axios
3. Backend (Render) receives request
4. Backend validates and processes data
5. Backend interacts with MongoDB Atlas
6. Backend sends OTP email via Gmail SMTP
7. Backend returns response to frontend
8. Frontend updates UI based on response

---

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed, select: false),
  mobile: String (required, 10 digits),
  gender: String (enum: ['Male', 'Female', 'Other']),
  state: String (required),
  pinCode: String (required, 6 digits),
  isVerified: Boolean (default: false),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### OTP Collection
```javascript
{
  _id: ObjectId,
  email: String (required, indexed),
  otp: String (required, SHA-256 hashed),
  purpose: String (enum: ['registration', 'reset']),
  attempts: Number (default: 0, max: 5),
  createdAt: Date (TTL index: expires after 10 minutes)
}
```

### Indexes
- **User.email** - Unique index for fast lookups
- **OTP.email** - Index for quick OTP retrieval
- **OTP.createdAt** - TTL index for automatic deletion

---

## 🔌 API Endpoints

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://mern-auth-backend-h94t.onrender.com/api`

### Authentication Routes (`/api/auth`)

#### 1. Register User
```
POST /auth/register
Body: {
  name: string,
  email: string,
  password: string,
  mobile: string,
  gender: string,
  state: string,
  pinCode: string
}
Response: {
  success: true,
  message: "OTP sent to email"
}
```

#### 2. Verify OTP
```
POST /auth/verify-otp
Body: {
  email: string,
  otp: string (6 digits)
}
Response: {
  success: true,
  token: "JWT_TOKEN",
  user: { ...userObject }
}
```

#### 3. Resend OTP
```
POST /auth/resend-otp
Body: {
  email: string,
  purpose: "registration" | "reset"
}
Response: {
  success: true,
  message: "OTP resent"
}
```

#### 4. Login
```
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: true,
  token: "JWT_TOKEN",
  user: { ...userObject }
}
```

#### 5. Forgot Password
```
POST /auth/forgot-password
Body: {
  email: string
}
Response: {
  success: true,
  message: "If email exists, OTP sent"
}
```

#### 6. Reset Password
```
POST /auth/reset-password
Body: {
  email: string,
  otp: string,
  newPassword: string
}
Response: {
  success: true,
  message: "Password reset successful"
}
```

### User Routes (`/api/users`)

#### 7. Get Current User (Protected)
```
GET /users/me
Headers: {
  Authorization: "Bearer JWT_TOKEN"
}
Response: {
  success: true,
  user: { ...userObject }
}
```

---

## 🔒 Security Implementation

### 1. Password Security
- **Hashing Algorithm:** bcrypt with 12 salt rounds
- **Implementation:** Pre-save hook in User model
- **Storage:** Never stored in plain text
- **Retrieval:** `select: false` prevents accidental exposure

```javascript
// Password is hashed before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

### 2. OTP Security
- **Generation:** `crypto.randomInt()` - cryptographically secure
- **Hashing:** SHA-256 before database storage
- **Expiry:** 10-minute TTL via MongoDB index
- **Brute Force:** Max 5 attempts, then OTP invalidated
- **Purpose-based:** Separate OTPs for registration vs reset

```javascript
// OTP is hashed before storage
const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
```

### 3. JWT Authentication
- **Algorithm:** HS256 (HMAC with SHA-256)
- **Expiry:** 7 days
- **Secret:** Stored in environment variable
- **Transmission:** Bearer token in Authorization header
- **Validation:** Middleware on protected routes

```javascript
// JWT is verified on every protected route
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 4. CORS Protection
- **Origin:** Restricted to frontend URL only
- **Credentials:** Enabled for cookie support
- **Methods:** Only necessary HTTP methods allowed

### 5. Email Enumeration Protection
- **Forgot Password:** Returns generic message regardless of email existence
- **Prevents:** Attackers from discovering valid email addresses

### 6. Input Validation
- **Email:** Validated format and uniqueness
- **Password:** Minimum length requirements
- **Mobile:** 10-digit validation
- **Pin Code:** 6-digit validation

---

## 🎨 Frontend Structure

### Component Hierarchy
```
App.jsx (Root)
├── Navbar.jsx (Navigation)
├── Routes
│   ├── Home.jsx (Landing page)
│   ├── Register.jsx (Registration form)
│   ├── VerifyOtp.jsx (OTP verification)
│   ├── Login.jsx (Login form)
│   ├── ForgotPassword.jsx (Request reset OTP)
│   ├── ResetPassword.jsx (Reset with OTP)
│   └── Dashboard.jsx (Protected - User profile)
│       ├── Overview Tab
│       ├── Profile Tab
│       └── Security Tab
└── Footer.jsx (Developer credit)
```

### State Management
- **AuthContext:** Global authentication state
  - `user` - Current user object
  - `token` - JWT token
  - `login()` - Login function
  - `logout()` - Logout function
  - `loading` - Loading state

### Routing Protection
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```
- Checks for valid JWT token
- Redirects to login if unauthenticated
- Validates token with backend

### API Integration
- **Axios Instance:** Centralized API configuration
- **Interceptors:** 
  - Request: Attach JWT to every request
  - Response: Auto-logout on 401 errors

---

## ⚙️ Backend Structure

### Directory Organization
```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User schema with bcrypt
│   └── Otp.js               # OTP schema with TTL
├── controllers/
│   ├── authController.js    # Auth logic (register, login, etc.)
│   └── userController.js    # User operations
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── userRoutes.js        # User endpoints
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   └── errorHandler.js      # Global error handling
├── utils/
│   ├── generateOtp.js       # OTP generation & hashing
│   ├── sendEmail.js         # Nodemailer configuration
│   └── generateToken.js     # JWT helper
├── server.js                # Express app entry point
├── .env                     # Environment variables
└── package.json             # Dependencies
```

### Middleware Chain
```
Request → CORS → JSON Parser → Route Handler → Auth Middleware → Controller → Response
```

### Error Handling
- **Global Handler:** Catches all errors
- **Async Wrapper:** Prevents try-catch repetition
- **Custom Errors:** Meaningful error messages
- **Status Codes:** Proper HTTP status codes

---

## 🔄 Authentication Flow

### Registration Flow
```
1. User fills registration form
   ↓
2. Frontend validates input
   ↓
3. POST /api/auth/register
   ↓
4. Backend validates data
   ↓
5. Check if email already exists
   ↓
6. Create user (password hashed automatically)
   ↓
7. Generate 6-digit OTP
   ↓
8. Hash OTP with SHA-256
   ↓
9. Save hashed OTP to database
   ↓
10. Send OTP email via Gmail SMTP
    ↓
11. Return success response
    ↓
12. Frontend redirects to verify-otp page
    ↓
13. User enters OTP from email
    ↓
14. POST /api/auth/verify-otp
    ↓
15. Backend hashes entered OTP
    ↓
16. Compare with stored hash
    ↓
17. Check attempts (max 5)
    ↓
18. If valid: Set isVerified = true
    ↓
19. Generate JWT token
    ↓
20. Return token + user data
    ↓
21. Frontend stores token in localStorage
    ↓
22. Redirect to dashboard
```

### Login Flow
```
1. User enters email & password
   ↓
2. POST /api/auth/login
   ↓
3. Find user by email
   ↓
4. Check if user exists
   ↓
5. Check if email is verified
   ↓
6. Compare password with bcrypt
   ↓
7. If valid: Generate JWT token
   ↓
8. Return token + user data
   ↓
9. Frontend stores token
   ↓
10. Redirect to dashboard
```

### Forgot Password Flow
```
1. User enters email
   ↓
2. POST /api/auth/forgot-password
   ↓
3. Check if user exists (silently)
   ↓
4. Generate reset OTP
   ↓
5. Hash and save OTP
   ↓
6. Send OTP email
   ↓
7. Return generic success message
   ↓
8. User enters OTP + new password
   ↓
9. POST /api/auth/reset-password
   ↓
10. Verify OTP
    ↓
11. Hash new password
    ↓
12. Update user password
    ↓
13. Delete OTP from database
    ↓
14. Return success
    ↓
15. Redirect to login
```

---

## 🚀 Deployment Process

### Step 1: Backend Deployment (Render)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Service**
   - Go to https://render.com
   - New Web Service → Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables** (see Environment Variables section)

4. **Deploy** → Get backend URL

### Step 2: Frontend Deployment (Vercel)

1. **Create Vercel Project**
   - Go to https://vercel.com
   - Import GitHub repository
   - Framework: Vite
   - Root Directory: `/` (project root)

2. **Add Environment Variable**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

3. **Deploy** → Get frontend URL

### Step 3: Update Backend CORS

1. Go to Render → Environment
2. Update `CLIENT_URL` with Vercel URL
3. Save → Auto-redeploys

### Step 4: Fix Client-Side Routing

1. Create `vercel.json` in project root:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. Push to GitHub → Vercel auto-redeploys

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern_auth?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=MERN Auth

# CORS
CLIENT_URL=https://your-frontend.vercel.app

# Server
PORT=5000
NODE_ENV=production

# OTP
OTP_EXPIRY_MINUTES=10
```

### Frontend (.env.local)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Getting Gmail App Password
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy 16-character password (remove spaces)

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### Registration Flow
- [ ] Fill registration form with valid data
- [ ] Submit and check for success message
- [ ] Check email inbox (and spam) for OTP
- [ ] Verify OTP email is properly formatted
- [ ] Enter correct OTP → Should redirect to dashboard
- [ ] Try wrong OTP → Should show error
- [ ] Try expired OTP (wait 10+ min) → Should fail
- [ ] Try 6 wrong attempts → OTP should be invalidated

#### Login Flow
- [ ] Login with correct credentials → Success
- [ ] Login with wrong password → Error
- [ ] Login with unverified email → Error
- [ ] Login with non-existent email → Error
- [ ] Check JWT token in localStorage
- [ ] Refresh page → Should stay logged in

#### Dashboard
- [ ] View overview tab with stats
- [ ] View profile tab with user details
- [ ] View security tab with features
- [ ] Logout → Should clear token and redirect

#### Forgot Password
- [ ] Enter registered email → OTP sent
- [ ] Enter non-existent email → Generic message (no leak)
- [ ] Check email for reset OTP
- [ ] Enter OTP + new password → Success
- [ ] Login with new password → Success

#### Protected Routes
- [ ] Try accessing /dashboard without login → Redirect to login
- [ ] Login and access /dashboard → Success
- [ ] Logout and try /dashboard again → Redirect

#### Responsive Design
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Check sidebar toggle on mobile

#### Edge Cases
- [ ] Paste OTP in first box → Should auto-fill all boxes
- [ ] Resend OTP → Should work with cooldown
- [ ] Multiple browser tabs → Token should sync
- [ ] Network error handling → Should show error toast

---

## 🚧 Challenges & Solutions

### Challenge 1: OTP Security
**Problem:** Storing plain OTPs in database is insecure  
**Solution:** Hash OTPs with SHA-256 before storage, compare hashes during verification

### Challenge 2: Email Delivery
**Problem:** Gmail blocking emails, going to spam  
**Solution:** Use App Password instead of regular password, configure proper SMTP settings

### Challenge 3: CORS Errors
**Problem:** Frontend can't connect to backend due to CORS  
**Solution:** Configure CORS middleware with exact frontend URL (no trailing slash)

### Challenge 4: 404 on Page Refresh
**Problem:** Vercel returns 404 when refreshing routes like /dashboard  
**Solution:** Add vercel.json with rewrite rules to redirect all routes to index.html

### Challenge 5: Environment Variables Not Loading
**Problem:** Vite not reading VITE_API_URL  
**Solution:** Must redeploy after adding env vars (Vite loads them at build time)

### Challenge 6: Cold Starts on Free Tier
**Problem:** Render free tier sleeps after 15 min inactivity  
**Solution:** Accept 30-60s initial load time, or upgrade to paid tier

### Challenge 7: JWT Token Expiry
**Problem:** Users getting logged out unexpectedly  
**Solution:** Set 7-day expiry, implement token refresh logic (future enhancement)

### Challenge 8: Brute Force OTP Attacks
**Problem:** Attackers trying multiple OTP combinations  
**Solution:** Limit to 5 attempts, then invalidate OTP

---

## 🔮 Future Enhancements

### Short-term (Easy)
- [ ] Add profile picture upload
- [ ] Implement "Remember Me" functionality
- [ ] Add email change with OTP verification
- [ ] Show last login time and IP
- [ ] Add activity log (login history)
- [ ] Implement rate limiting on API endpoints
- [ ] Add password strength meter
- [ ] Social login (Google, GitHub)

### Medium-term (Moderate)
- [ ] Two-factor authentication (2FA)
- [ ] SMS OTP as alternative to email
- [ ] Email templates with better design
- [ ] Admin dashboard for user management
- [ ] User roles and permissions
- [ ] Account deletion with confirmation
- [ ] Export user data (GDPR compliance)
- [ ] Dark mode toggle

### Long-term (Complex)
- [ ] Refresh token implementation
- [ ] WebSocket for real-time notifications
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] API rate limiting per user
- [ ] Microservices architecture
- [ ] Redis caching for sessions
- [ ] Kubernetes deployment

---

## 📊 Project Statistics

- **Total Files:** 30+
- **Lines of Code:** ~2,500+
- **Development Time:** 2-3 weeks
- **API Endpoints:** 7
- **React Components:** 12
- **Database Collections:** 2
- **Security Features:** 9
- **Deployment Platforms:** 3

---

## 🎓 Learning Outcomes

### Technical Skills Gained
- Full-stack MERN development
- JWT authentication implementation
- Email integration with Nodemailer
- Password hashing with bcrypt
- MongoDB schema design and indexing
- React Context API for state management
- Protected routes (frontend + backend)
- RESTful API design
- Deployment on cloud platforms
- Environment variable management
- CORS configuration
- Error handling and validation

### Best Practices Learned
- Security-first development approach
- Separation of concerns (MVC pattern)
- DRY (Don't Repeat Yourself) principle
- Proper error handling
- Input validation and sanitization
- Environment-based configuration
- Git version control
- Documentation writing

---

## 📚 Resources & References

### Documentation
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Docs](https://nodejs.org/docs/)
- [JWT.io](https://jwt.io/)
- [Nodemailer Guide](https://nodemailer.com/)

### Tutorials & Guides
- bcrypt password hashing
- JWT authentication best practices
- MongoDB TTL indexes
- React Router v6
- Tailwind CSS utility classes
- Vercel deployment guide
- Render deployment guide

---

## 👨‍💻 Developer Information

**Name:** Amaan Ahmed  
**Project Type:** Full-Stack Web Application  
**Purpose:** Portfolio Project / Learning  
**License:** MIT  

### Contact
- GitHub: [Your GitHub Profile]
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]

---

## 📝 Conclusion

This MERN Email OTP Authentication System demonstrates a complete, production-ready implementation of user authentication with real email verification. It showcases modern web development practices, security best practices, and full-stack development skills.

The project successfully implements:
- ✅ Secure user registration and login
- ✅ Real email OTP verification
- ✅ Password reset functionality
- ✅ Protected routes and JWT authentication
- ✅ Responsive UI with modern design
- ✅ Cloud deployment on free tier services

This project serves as a strong foundation for any web application requiring user authentication and can be easily extended with additional features.

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
