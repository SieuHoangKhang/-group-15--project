// Simple test script to call the Brevo email send function and print/save the result.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sendResetPasswordEmail } = require('../services/emailService');

async function run() {
  // allow passing recipient as first arg, fallback to BREVO_TEST_TO or BREVO_FROM_EMAIL
  const to = process.argv[2] || process.env.BREVO_TEST_TO || process.env.BREVO_FROM_EMAIL;
  if (!to) {
    console.error('Usage: node scripts/send-test-email.js recipient@example.com');
    process.exit(1);
  }

  const token = 'test-token-' + Date.now();
  try {
    const res = await sendResetPasswordEmail(to, token);
    console.log('Send result:', res);
    process.exit(0);
  } catch (err) {
    console.error('Send failed:', err && err.body ? err.body : err);
    try {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      fs.mkdirSync(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, 'brevo-last-error.txt');
      fs.writeFileSync(filePath, JSON.stringify(err && err.body ? err.body : err, null, 2), 'utf8');
      console.error('Wrote error details to', filePath);
    } catch (e) {
      console.error('Failed to write error file:', e);
    }
    process.exit(2);
  }
}

run();
