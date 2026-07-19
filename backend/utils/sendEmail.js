// ============================================
// Real email sender using Brevo HTTP API
// ============================================
const Brevo = require('@getbrevo/brevo');

const client = Brevo.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

console.log('✅ Brevo email client ready');

/**
 * Send an email
 * @param {{ to: string, subject: string, html: string, text?: string }} opts
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { name: process.env.EMAIL_FROM_NAME || 'MERN Auth', email: process.env.EMAIL_FROM };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.textContent = text;

  const info = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log(`📧 Email sent to ${to} | messageId: ${info.messageId}`);
  return info;
};

// Pre-built OTP email template
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
