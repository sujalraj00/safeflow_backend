const express = require('express');
const router = express.Router();
const { analyzeFloodRisk } = require('../controllers/floodController');

router.post('/flood-risk', analyzeFloodRisk);

module.exports = router;
