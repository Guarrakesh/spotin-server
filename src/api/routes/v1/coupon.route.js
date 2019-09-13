const express = require('express');
const validate = require('express-validation');
const couponController = require('../../controllers/v1/coupon.controller');
const validation = require('../../validations/couponcode.validation');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/use')
  .post(authorize(LOGGED_USER), validate(validation.useCoupon), couponController.useCoupon);

module.exports = router;