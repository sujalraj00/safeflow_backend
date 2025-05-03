const express = require('express');
const router = express.Router();

const { predictFlood } = require('../controllers/predictionController');

router.post('/check-flood', predictFlood);

module.exports = router; 