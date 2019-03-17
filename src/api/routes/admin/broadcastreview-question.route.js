const express = require('express');
const controller = require('../../controllers/admin/broadcastreview-question.controller');
const validate = require('express-validation');
const { authorize, ADMIN } = require('../../middlewares/auth');

const router = express.Router();
router.param('id', controller.load);

router
    .route('/')
    .get(authorize(ADMIN), controller.list)
    .post(authorize(ADMIN), controller.create);

router
    .route('/:id')
    .get(authorize(ADMIN), controller.get);


module.exports = router;
