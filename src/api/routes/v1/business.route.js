const express = require('express');
const router = express.Router();
const controller = require('../../controllers/v1/business.controller.js');
const validate = require('express-validation');
const multer = require('multer');

const upload = multer({limits: {fileSize: 10*1024*1024}});
const { createBusiness, updateBusiness } = require('../../validations/business.validation.js');

const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');

router.param('id', controller.load);


router
  .route('/')
  .get(controller.list)


router
  .route('/:id')
  .get(authorize([LOGGED_USER, BUSINESS]), controller.get)
  .patch(authorize(ADMIN), [upload.single('picture'),validate(updateBusiness)], controller.update);


router
  .route('/:id/past-offers')
  .get(authorize(BUSINESS), controller.pastOffers);


module.exports = router;
