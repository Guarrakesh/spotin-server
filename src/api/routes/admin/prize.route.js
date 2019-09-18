const express = require('express');
const validate = require('express-validation');
const prizeController = require('../../controllers/admin/prize.controller');
const validation = require('../../validations/couponcode.validation');
const { authorize, ADMIN } = require('../../middlewares/auth');
const { filterRestQuery } = require('../../middlewares/restParser');
const router = express.Router();

router.param('id', prizeController.load);
router
    .route('/')
    .get(authorize(ADMIN), filterRestQuery, prizeController.list)
    .post(authorize(ADMIN), prizeController.create);

router
    .route('/:id')
    .get(authorize(ADMIN), prizeController.get)
    .delete(authorize(ADMIN), prizeController.remove);
module.exports = router;