const express = require('express');
const controller = require('../../controllers/admin/broadcastreview-question.controller');
const validate = require('express-validation');
const { authorize, ADMIN } = require('../../middlewares/auth');
const { create: createValidation, update: updateValidation } = require('../../validations/broadcastreview-question.validation');

const router = express.Router();
router.param('id', controller.load);

router
    .route('/')
    .get(authorize(ADMIN), controller.list)
    .post(authorize(ADMIN), validate(createValidation), controller.create);

router
    .route('/:id')
    .get(authorize(ADMIN), controller.get)
    .patch(authorize(ADMIN), validate(updateValidation), controller.update)
    .delete(authorize(ADMIN), controller.remove)
;

module.exports = router;
