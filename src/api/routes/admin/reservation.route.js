const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/reservation.controller.js');
const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');

const { createReservation, listReservations } = require('../../validations/reservation.validation');

const router = express.Router();



router
  .route('/')
  .post(authorize(ADMIN), validate(createReservation), controller.create)
  .get(authorize(ADMIN), validate(listReservations), controller.list);
module.exports = router;
