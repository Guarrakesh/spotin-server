const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/business.controller.js');
const validate = require('express-validation');
const multer = require('multer');

const upload = multer({limits: {fileSize: 10*1024*1024}});
const { createBusiness, updateBusiness } = require('../../validations/business.validation.js');

const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');

router.param('id', controller.load);


router
  .route('/')
  .get(controller.list)
  .post(authorize(ADMIN), [upload.single('picture'),validate(createBusiness)], controller.create);
router
  .route('/:id')
  .get(controller.get)
  .patch(authorize(ADMIN), [upload.single('picture'),validate(updateBusiness)], controller.update)
  .delete(authorize(ADMIN), controller.remove)
;


module.exports = router;
