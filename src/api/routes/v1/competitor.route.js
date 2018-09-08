const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/competitor.controller.js');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { createCompetitor, updateCompetitor, listCompetitors } = require('../../validations/competitor.validation');
const multer = require('multer');

const upload = multer({limits: {fileSize: 10*1024*1024}});
const router = express.Router();

router.param('id', controller.load);

router
  .route('/')
  .get(authorize(ADMIN), validate(listCompetitors), controller.list)
  .post(authorize(ADMIN), validate(createCompetitor), controller.create)
;
router
  .route('/:id')
  .get(authorize(ADMIN), controller.get)
  .patch(authorize(ADMIN), [upload.single('picture'), validate(updateCompetitor)], controller.update)
  .delete(authorize(ADMIN), controller.remove)
;

module.exports = router;
