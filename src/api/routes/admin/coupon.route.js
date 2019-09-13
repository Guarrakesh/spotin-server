const express = require('express');
const validate = require('express-validation');
const couponController = require('../../controllers/admin/coupon.controller');
const validation = require('../../validations/couponcode.validation');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(authorize(ADMIN), couponController.get)
    .post(authorize(ADMIN), couponController.create);

module.exports = router;