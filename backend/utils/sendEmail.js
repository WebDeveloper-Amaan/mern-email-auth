// ============================================
// Email sender — Gmail SMTP locally, Sendcorex API in production
// ============================================
const nodemailer = require('nodemailer');
const https = require('https');

const isProduction = process.env.NODE_ENV === 'production';

// ── Local: Gmail SMTP ──
let transporter;
if (!isProduction) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  transporter.verify((err) => {
    if (err) console.error('❌ SMTP config error:', err.message);
    else console.log('✅ SMTP server ready to send emails');
  });
} else {
  console.log('✅ Sendcorex API ready to send emails');
}

// ── Production: Sendcorex HTTP API ──
const sendViaSendcorex = ({ to, subject, html, text }) => {
  const data = JSON.stringify({
    from: process.env.EMAIL_FROM,
    senderName: process.env.EMAIL_FROM_NAME || 'MERN Auth',
    to: to,
    subject,
    body: html,
    text: text || subject,
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'mail.sendcorex.com',
      path: '/v3.0/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${process.env.SENDCOREX_API_KEY}`,
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          console.log(`📡 Sendcorex status: ${res.statusCode}, body: ${body}`);
          if (res.statusCode >= 400) return reject(new Error(`Sendcorex error ${res.statusCode}: ${body}`));
          if (!body) { console.log(`📧 Email sent to ${to}`); return resolve({}); }
          const parsed = JSON.parse(body);
          console.log(`📧 Email sent to ${to}`);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Parse error: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

// ── Main sendEmail function ──
const sendEmail = async ({ to, subject, html, text }) => {
  if (isProduction) {
    return sendViaSendcorex({ to, subject, html, text });
  }

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'MERN Auth'}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    text,
    html,
  });
  console.log(`📧 Email sent to ${to} | messageId: ${info.messageId}`);
  return info;
};

// ── OTP Email Template ──
const buildOtpEmail = (name, otp, purpose) => {
  const title = purpose === 'reset' ? 'Reset your password' : 'Verify your email';
  const intro =
    purpose === 'reset'
      ? 'Use the OTP below to reset your password.'
      : 'Welcome! Use the OTP below to verify your email and activate your account.';

  return `
  <div style="font-family: Arial, sans-serif; max-width:560px; margin:0 auto; padding:24px; background:#f9fafb; color:#111827;">
    <div style="background:#fff; border-radius:12px; padding:32px; box-shadow:0 1px 3px rgba(0,0,0,.08);">
      <h1 style="margin:0 0 8px; font-size:22px; color:#4f46e5;">${title}</h1>
      <p style="margin:0 0 20px; color:#374151;">Hi ${name || 'there'}, ${intro}</p>
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; font-size:32px; letter-spacing:8px; font-weight:700; text-align:center; padding:18px; border-radius:10px; margin:20px 0;">
        ${otp}
      </div>
      <p style="margin:0 0 8px; color:#6b7280; font-size:14px;">This code expires in <strong>${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong>.</p>
      <p style="margin:0; color:#6b7280; font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
      <p style="margin:0; font-size:12px; color:#9ca3af;">© ${new Date().getFullYear()} MERN Auth System</p>
    </div>
  </div>`;
};

module.exports = { sendEmail, buildOtpEmail };
