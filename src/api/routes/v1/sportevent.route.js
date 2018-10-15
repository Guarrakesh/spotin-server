const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/v1/sportevent.controller.js');
const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');
const {createEvent, updateEvent } = require('../../validations/sportevent.validation');
const router = express.Router();
const broadcastController = require('../../controllers/v1/broadcast.controller.js');
/**
 * Load user when API with userId route parameter is hit
 */


router.param('id', controller.load);

router
  .route('/')
  .get(authorize([ADMIN, LOGGED_USER, BUSINESS]), controller.list)
  .post(authorize(ADMIN), validate(createEvent), controller.create);


router
  .route('/:id')
  .get(authorize([ADMIN, LOGGED_USER,BUSINESS]),controller.get)
  .patch(authorize(ADMIN), validate(updateEvent), controller.update)
  .delete(authorize(ADMIN), controller.remove);


/*
router
  .route('/:id/broadcasts')
    .get(broadcastController.list);
*/




module.exports = router;
