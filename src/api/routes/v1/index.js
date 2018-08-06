const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const sportRoutes = require('./sport.route');
const s3Routes = require('./s3.route');
const competitionRoutes = require('./competition.route');
const sportEventRoutes = require('./sportevent.route');
const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/s3', s3Routes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/sports', sportRoutes);
router.use('/competitions',competitionRoutes);
router.use('/events', sportEventRoutes);
module.exports = router;
