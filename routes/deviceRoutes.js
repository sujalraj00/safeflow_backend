// routes/deviceRoutes.js
const express = require('express');
const router = express.Router();
const Token = require('../models/Token'); 

router.post('/register-token', async (req, res) => {
  const { userId, token } = req.body;

  try {
    await Token.findOneAndUpdate(
      { userId },
      { token },
      { upsert: true, new: true }
    );
    res.json({ message: 'Token registered' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save token' });
  }
});

module.exports = router;
