

const express = require('express');
const router = express.Router();

const { authorize, LOGGED_USER, BUSINESS, ADMIN } = require('../../middlewares/auth');
const validate = require('express-validation');

const { createBroadcast } = require('../../validations/broadcast.validation');

const controller = require('../../controllers/v1/broadcast.controller.js');

router.param('id', controller.load);

router
  .route('/')
  .get(authorize([LOGGED_USER], null, false), controller.list)
  .post(authorize([BUSINESS, ADMIN]), validate(createBroadcast), controller.create)
;

router
  .route('/:id')
  .get(authorize([LOGGED_USER], null, false), controller.get)
  .delete(authorize(ADMIN), controller.remove);
  
module.exports = router;
