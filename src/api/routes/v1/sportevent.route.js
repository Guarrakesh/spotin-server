const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/sportevent.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {createEvent, updateEvent } = require('../../validations/sportevent.validation');
const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */


router.param('sportId', controller.load);

router
  .route('/')
  .get(controller.list)
  .post(authorize(ADMIN), validate(createEvent), controller.create);


router
  .route('/:id')
  .get(controller.get)
  .patch(authorize(ADMIN), validate(updateEvent), controller.update)
  .delete(authorize(ADMIN), controller.remove);





module.exports = router;
