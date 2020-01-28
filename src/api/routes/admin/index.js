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
const bBundleRoutes = require('./broadcastbundle.route');
const couponRoutes = require('./coupon.route');
const settingRoutes = require('./setting.route');
const prizeRoutes = require('./prize.route');
const layoutElementRoutes = require('./layout/layoutelement.route');
const appLayoutBlockRoutes = require('./layout/applayoutblock.route');
const eventRoutes = require('./event.route');
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
router.use('/broadcasts', broadcastRoutes);
router.use('/businesses', businessRoute);
router.use('/competitors', competitorRoutes);
router.use('/reservations', reservationRoutes);
router.use('/requests', requestRoutes);
router.use('/settings', settingRoutes);
router.use('/broadcastbundles', bBundleRoutes);
router.use('/coupons', couponRoutes);
router.use('/prizes', prizeRoutes);
router.use('/layout-elements', layoutElementRoutes);
router.use('/app-layout-blocks', appLayoutBlockRoutes);
router.use('/systemevents', eventRoutes);

router.route('/sendfcm').get(async (req, res) => {
  const notificationService = req.app.get('container').get('notificationService');
  const userService =  req.app.get('container').get('userService');

  const user = await userService.findOne({ email: 'minkiazza91@hotmail.it'});
  if (user) {

    const response= await notificationService.sendToUser(user.id, {
      notification: { title: "Nuovi eventi!", body: "Scopri i nuovi eventi di questa settimana!", imageUrl: "https://source.unsplash.com/random" },
    }, true);
    return res.json(response);
  }
  res.json({});
});
module.exports = router;

//1FB56EE6-1EAF-4B36-B5B8-37DD20E30FAA
//fr7xgOr06Tw:APA91bEUVS-DpN0YFxv51eU_5IMguGLrf-Eo0OkAaTS1-H-M0IN26mTLTbJyF2p8VWMrcXllZoxEHu-ArAs632usQ69MVJ43lAhtQ7rFzNc5Pu_UFM4XykQMipzAheQRYbrSXnrfuWEq
