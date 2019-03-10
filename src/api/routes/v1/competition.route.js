const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/v1/sport.controller.js');
const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');
const eventController = require('../../controllers/v1/sportevent.controller.js');
const competitionController = require('../../controllers/v1/competition.controller.js');
const router = express.Router();
const { createCompetition, updateCompetition } = require('../../validations/competition.validation');
const multer = require('multer');

const upload = multer({limits: {fileSize: 10*1024*1024}});
/**
 * Load user when API with userId route parameter is hit
 */



router.param('id', competitionController.load);


router
  .route('/')
  .get(authorize([LOGGED_USER], null, true), competitionController.list)

  .post(authorize(ADMIN), [upload.single('picture'),validate(createCompetition)], competitionController.create);

router
  .route('/:id')
  .get(authorize([LOGGED_USER], null, true), competitionController.get)
  .patch(authorize(ADMIN), [upload.single('picture'),validate(updateCompetition)], competitionController.update)
  .delete(authorize(ADMIN), competitionController.remove);
router
  .route('/:id/events')
  .get(eventController.list);



module.exports = router;
