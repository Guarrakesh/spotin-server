const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/sport.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const eventController = require('../../controllers/sportevent.controller');
const competitionController = require('../../controllers/competition.controller');
const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */



router.param('id', controller.load);

router
  .route('/')
  .get(authorize(LOGGED_USER),controller.list);

router
  .route('/:id')

  .get(authorize(LOGGED_USER),controller.get);

router
  .route('/:id/competitions')
  .get(authorize(LOGGED_USER),competitionController.list)
router
  .route('/:id/events')
  .get(authorize(LOGGED_USER),eventController.list)




module.exports = router;
