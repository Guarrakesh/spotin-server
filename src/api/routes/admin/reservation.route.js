const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/reservation.controller.js');

const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');
const { create: createReview, update: updateReview } = require('../../validations/broadcastreview.validation');

const { createReservation, listReservations } = require('../../validations/reservation.validation');

const router = express.Router();



router
  .route('/')
  .post(authorize(ADMIN), validate(createReservation), controller.create)
  .get(authorize(ADMIN), validate(listReservations), controller.list);

router
    .route('/:id')
    .get(authorize(ADMIN), controller.get);
router
    .route('/:id/reviews/:reviewId')
    .patch(authorize(ADMIN), validate(updateReview), controller.review)
;

module.exports = router;
