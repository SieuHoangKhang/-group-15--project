// backend/services/emailService.js
const axios = require('axios');

/**
 * Send reset password email using Brevo (Sendinblue) transactional API via direct HTTP request.
 * This avoids SDK compatibility issues and is simpler to debug.
 * @param {string} toEmail
 * @param {string} resetToken
 */
async function sendResetPasswordEmail(toEmail, resetToken) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) throw new Error('BREVO_API_KEY not configured');

  // For security/privacy preference we send ONLY the plain token in the email body
  // (no clickable reset link). The user can copy the token into the app's
  // "Đổi mật khẩu bằng token" dialog to reset their password.
  const payload = {
    sender: { name: process.env.BREVO_FROM_NAME || 'No Reply', email: process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM || 'no-reply@example.com' },
    to: [{ email: toEmail }],
    subject: 'Yêu cầu đặt lại mật khẩu',
    htmlContent: `
      <h2>Đặt lại mật khẩu</h2>
      <p>Bạn (hoặc ai đó) đã gửi yêu cầu đặt lại mật khẩu. Token dưới đây có hiệu lực 15 phút.</p>
      <pre style="word-break:break-all; background:#f6f6f6; padding:8px; border-radius:6px;">${resetToken}</pre>
      <p>Vui lòng copy token và dán vào phần "Đổi mật khẩu bằng token" trong ứng dụng để đặt mật khẩu mới.</p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `,
    textContent: `Đặt lại mật khẩu\n\nToken: ${resetToken}\n\nToken có hiệu lực 15 phút. Dán token vào phần 'Đổi mật khẩu bằng token' trong ứng dụng. Nếu bạn không yêu cầu, bỏ qua email này.`,
  };

  try {
    const res = await axios.post('https://api.sendinblue.com/v3/smtp/email', payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    console.log('Brevo send success:', res.status, res.data);
    return res.data;
  } catch (err) {
    // Normalize error body for logging
    if (err.response) {
      console.error('Brevo send failed (response):', err.response.status, err.response.data);
      const e = new Error('Brevo send failed');
      e.body = err.response.data;
      throw e;
    }
    console.error('Brevo send failed (error):', err.message || err);
    throw err;
  }
}

module.exports = { sendResetPasswordEmail };
