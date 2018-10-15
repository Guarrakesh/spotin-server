const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/v1/reservation.controller.js');
const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');

const { createReservation, listReservations } = require('../../validations/reservation.validation');

const router = express.Router();

//router.param('id', controller.load);

router
  .route('/')
  .post(authorize(ADMIN), validate(createReservation), controller.create)
  .get(authorize([LOGGED_USER, BUSINESS]), validate(listReservations), controller.list);

router
  .route('/:id')
  .get(authorize(LOGGED_USER), controller.get);

module.exports = router;
