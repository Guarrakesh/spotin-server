const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/v1/activity.controller.js');
const { authorize, ADMIN } = require('../../middlewares/auth');

const { create } = require('../../validations/activity.validation');
const router = express.Router();

//router.param('id', controller.load);

router
    .route('/')
    .post(validate(create), controller.create)
    .get(authorize([ADMIN]), controller.list);

router
    .route('/:id')
    .get(authorize(ADMIN), controller.get);

module.exports = router;
