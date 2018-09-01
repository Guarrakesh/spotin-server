

const express = require('express');
const router = express.Router();

const { authorize, LOGGED_USER, BUSINESS, ADMIN } = require('../../middlewares/auth');
const validate = require('express-validation');

const { createBroadcast } = require('../../validations/broadcast.validation');

const controller = require('../../controllers/broadcast.controller');

router.param('id', controller.load);

router
  .route('/')
  .get(controller.list)
  .post(authorize([BUSINESS, ADMIN]), validate(createBroadcast), controller.create)
;

router
  .route('/:id')
  .get(controller.get);




module.exports = router;
