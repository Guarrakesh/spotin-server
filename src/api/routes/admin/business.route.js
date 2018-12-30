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
  .post(authorize(ADMIN), [
    upload.fields([
      { name: 'picture', maxCount: 1 },
      { name: 'pictures', maxCount: 5 },
    ]),
    validate(createBusiness),
  ], controller.create);
router
  .route('/:id')
  .get(controller.get)
  .patch(authorize(ADMIN), [
      upload.fields([
        { name: 'picture', maxCount: 1 },
        { name: 'pictures', maxCount: 5 },
      ]),

    validate(updateBusiness),
  ], controller.update)
  .delete(authorize(ADMIN), controller.remove)
;


module.exports = router;
