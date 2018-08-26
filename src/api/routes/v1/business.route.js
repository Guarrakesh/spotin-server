const express = require('express');
const router = express.Router();
const controller = require('../../controllers/business.controller');
const validate = require('express-validation');

const { createBusiness, updateBusiness } = require('../../validations/business.validation.js');

const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

router.param('id', controller.load);


router
  .route('/')
  .get(controller.list)
  .post(authorize(ADMIN), validate(createBusiness), controller.create);

router
  .route('/:id')
  .get(controller.get)
  .patch(authorize(ADMIN), validate(updateBusiness), controller.update);


module.exports = router;

