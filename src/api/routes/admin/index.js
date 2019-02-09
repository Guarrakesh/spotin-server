const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const sportRoutes = require('./sport.route');
const s3Routes = require('./s3.route');
const competitionRoutes = require('./competition.route');
const sportEventRoutes = require('./sportevent.route');
const broadcastRoutes = require('./broadcast.route');
const businessRoute = require('./business.route');
const competitorRoutes = require('./competitor.route');
const reservationRoutes = require('./reservation.route');
const requestRoutes = require('./request.route');
const router = express.Router();


const weekController = require('../../controllers/admin/broadcastbundle.controller');
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
router.use('/broadcasts', broadcastRoutes);
router.use('/businesses', businessRoute);
router.use('/competitors', competitorRoutes);
router.use('/reservations', reservationRoutes);
router.use('/requests', requestRoutes);

console.log(weekController);
router.route('/aa/' + 'get_week_events')
    .get(weekController.get);


module.exports = router;
