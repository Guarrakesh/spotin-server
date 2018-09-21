const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/reservation.controller');
const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');

const { createReservation } = require('../../validations/reservation.validation');

const router = express.Router();



router
  .route('/')
  .post(authorize(LOGGED_USER), validate(createReservation), controller.create);


module.exports = router;
