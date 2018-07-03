const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/sport.controller');
//const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const eventController = require('../../controllers/sportevent.controller');
const competitionController = require('../../controllers/competition.controller');
const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */



router.param('id', competitionController.load);


router
  .route('/:id')
  .get(competitionController.get);
router
  .route('/:id/events')
  .get(eventController.list);



module.exports = router;
