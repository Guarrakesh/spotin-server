const express = require('express');
const controller = require('../../controllers/admin/request.controller');
const validate = require('express-validation');
const { authorize, ADMIN } = require('../../middlewares/auth');
const { createContactRequest } = require('../../validations/contactRequest.validation');


const router = express.Router();

router
  .route('/')
  .get(authorize(ADMIN), controller.list);

router
  .route('/:id')
  .get(authorize(ADMIN), controller.get);


module.exports = router;
