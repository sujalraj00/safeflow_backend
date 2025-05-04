const express = require('express');
const router = express.Router();
const Token = require('../models/Token');

// Save user FCM token
router.post('/register-token', async (req, res) => {
  const { token, userType } = req.body;

  if (!token || !userType) return res.status(400).json({ error: "Token and userType are required" });

  try {
    await Token.updateOne(
      { token },
      { token, userType },
      { upsert: true }
    );
    res.json({ message: 'Token saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save token' });
  }
});

module.exports = router;
