

const express = require('express');
const router = express.Router();

const { authorize, LOGGED_USER, BUSINESS, ADMIN } = require('../../middlewares/auth');
const validate = require('express-validation');

const { createBroadcast } = require('../../validations/broadcast.validation');

const controller = require('../../controllers/admin/broadcast.controller.js');

router.param('id', controller.load);

router
  .route('/')
  .get(authorize([ADMIN]), controller.list)
  .post(authorize([ADMIN]), validate(createBroadcast), controller.create)
;

router
  .route('/:id')
  .get(authorize(ADMIN), controller.get)
  .patch(authorize(ADMIN), controller.update)
  .delete(authorize(ADMIN), controller.remove);
  
module.exports = router;
