const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let cloudinaryAvailable = false;
try {
  require.resolve('cloudinary');
  cloudinaryAvailable = true;
} catch (e) {
  cloudinaryAvailable = false;
}

// GET /api/debug/status
// Returns safe diagnostic info: whether server is running, env, mongo connection state, and Cloudinary presence.
router.get('/debug/status', (req, res) => {
  try {
    const mongoState = mongoose.connection && typeof mongoose.connection.readyState !== 'undefined'
      ? mongoose.connection.readyState
      : null;
    // Check whether backend/.env file contains CLOUDINARY_URL (safe flag, not the secret)
    let envFileHasCloudinary = false;
    try {
      const envPath = path.join(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        const txt = fs.readFileSync(envPath, 'utf8');
        envFileHasCloudinary = /CLOUDINARY_URL\s*=/.test(txt);
      }
    } catch (e) {
      envFileHasCloudinary = false;
    }
    // Also detect whether individual CLOUD_* vars exist in the running process
    const envHasCloudParts = !!(process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET);
    return res.json({
      ok: true,
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      cloudinaryAvailable: !!cloudinaryAvailable,
  cloudinaryConfigured: !!process.env.CLOUDINARY_URL,
  envFileHasCloudinary,
  envHasCloudParts,
      mongoState,
      timestamp: Date.now()
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Diagnostic failed' });
  }
});

module.exports = router;
