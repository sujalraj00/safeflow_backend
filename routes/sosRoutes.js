// // routes/sosRoutes.js
// const express = require('express');
// const router = express.Router();
// //const admin = require('../firebase/firebaseConfig');
// const Token = require('../models/Token');

// router.post('/trigger-sos', async (req, res) => {
//   try {
//     const userTokens = await Token.find({ userType: 'user' });

//     const messages = userTokens.map((user) => ({
//       token: user.token,
//       notification: {
//         title: '🚨 SOS Alert!',
//         body: 'Flood risk detected nearby. Take immediate precautions.',
//       },
//     }));

//     const response = await admin.messaging().sendEach(messages);
//     res.json({ success: true, response });
//   } catch (err) {
//     console.error('FCM Error:', err);
//     res.status(500).json({ error: 'Failed to send SOS alert' });
//   }
// });

// module.exports = router;
