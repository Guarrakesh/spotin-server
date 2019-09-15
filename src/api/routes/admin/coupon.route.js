const express = require('express');
const validate = require('express-validation');
const couponController = require('../../controllers/admin/coupon.controller');
const validation = require('../../validations/couponcode.validation');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { filterRestQuery } = require('../../middlewares/restParser');
const router = express.Router();

router.param('id', couponController.load);
router
    .route('/')
    .get(authorize(ADMIN), filterRestQuery, couponController.list)
    .post(authorize(ADMIN), couponController.create);

router
    .route('/:id')
    .get(authorize(ADMIN), couponController.get)
    .delete(authorize(ADMIN), couponController.remove);
module.exports = router;