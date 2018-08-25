const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/sport.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const eventController = require('../../controllers/sportevent.controller');
const competitionController = require('../../controllers/competition.controller');
const router = express.Router();

const { createCompetition, updateCompetition } = require('../../validations/competition.validation');
/**
 * Load user when API with userId route parameter is hit
 */



router.param('id', competitionController.load);

router
  .route('/')
  .get(competitionController.list)
  .post(authorize(ADMIN), validate(createCompetition), competitionController.create);
router
  .route('/:id')
  .get(competitionController.get)
  .patch(authorize(ADMIN), validate(createCompetition), competitionController.update)
  .delete(authorize(ADMIN), competitionController.remove);
router
  .route('/:id/events')
  .get(eventController.list);



module.exports = router;
