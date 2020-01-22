const express = require('express');

const router = express.Router();
const controller = require('../../../controllers/admin/layout/elementtype.controller');
const { authorize, ADMIN } = require('../../../middlewares/auth');

router.param('id', controller.load);

router
    .route('/')
    .get(authorize([ADMIN]), controller.list);


router
    .route('/:id')
    .get(authorize(ADMIN), controller.get);

module.exports = router;
