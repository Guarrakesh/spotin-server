const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/reservation.controller');
const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');

const { createReservation, listReservations } = require('../../validations/reservation.validation');

const router = express.Router();



router
  .route('/')
  .post(authorize(LOGGED_USER), validate(createReservation), controller.create)
  .get(authorize([LOGGED_USER, BUSINESS]), validate(listReservations), controller.list);
module.exports = router;
