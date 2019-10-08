const express = require('express');
const validate = require('express-validation');
const prizeController = require('../../controllers/v1/prize.controller');
const validation = require('../../validations/couponcode.validation');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(prizeController.list);

module.exports = router;
