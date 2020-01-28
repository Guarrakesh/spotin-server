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
const contactRequestRoutes = require('./contactRequest.route');
const activityRoutes = require('./activity.route');
const broadcastRequestRoutes = require('./broadcast-request.route');
const bReviewRoutes = require('./broadcastreview.route');
const couponRoutes = require('./coupon.route');
const prizeRoutes = require('./prize.route');
const router = express.Router();
const { authorize, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');
const httpStatus = require('http-status');

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
router.use('/contact-requests', contactRequestRoutes);
router.use('/broadcast-requests', broadcastRequestRoutes);
router.use('/broadcastreviews', bReviewRoutes);
router.use('/activities', activityRoutes);
router.use('/coupon', couponRoutes);
router.use('/prizes', prizeRoutes);


router.route('/notifications/:id/read').get(authorize([LOGGED_USER, BUSINESS]), async (req, res, next, id) => {
  const notificationService = req.app.get('container').get('notificationService');
  if (!req.locals || !req.locals.loggedUser) {
    res.status(httpStatus.UNAUTHORIZED);
    return res.json({});
  }
  const notification = await notificationService.markAsRead(req.locals.loggedUser.id, req.params.id);
  res.json(notification);
});



module.exports = router;
