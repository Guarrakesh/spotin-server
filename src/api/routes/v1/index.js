const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const sportEventRoutes = require('./sportevent.route');
const sportRoutes = require('./sport.route');
const competitionRoutes = require('./competition.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/sports', sportRoutes);
router.use('/competitions',competitionRoutes);

module.exports = router;
