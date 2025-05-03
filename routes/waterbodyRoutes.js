const express = require('express');
const router = express.Router();
const { getNearbyWaterBodies } = require('../controllers/waterbodyController');

router.post('/nearby-waterbodies', getNearbyWaterBodies);

module.exports = router;
