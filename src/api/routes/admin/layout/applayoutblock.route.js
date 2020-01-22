const express = require('express');

const router = express.Router();

const controller = require('../../../controllers/admin/layout/applayoutblock.controller');
const { authorize, ADMIN } = require('../../../middlewares/auth');

router.param('id', controller.load);

router
    .route('/')
    .get(authorize([ADMIN]), controller.list)
    .post(authorize(ADMIN), controller.create);

router
    .route('/:id')
    .get(authorize(ADMIN), controller.get)
    .patch(authorize(ADMIN), controller.update);

module.exports = router;
