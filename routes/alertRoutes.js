// routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('../firebaseService');
const Token = require('../models/Token');

router.post('/send-sos', async (req, res) => {
  const { title, message } = req.body;

  try {
    const tokens = await Token.find().select('token -_id');
    const tokenList = tokens.map(t => t.token);

    const payload = {
      notification: {
        title: title || "🚨 SOS ALERT",
        body: message || "Flood detected nearby. Please evacuate.",
      }
    };

    const response = await admin.messaging().sendToDevice(tokenList, payload);
    res.json({ message: 'Alert sent', response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send alert' });
  }
});

module.exports = router;
