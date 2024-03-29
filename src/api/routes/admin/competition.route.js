const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/sport.controller.js');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const eventController = require('../../controllers/admin/sportevent.controller.js');
const competitionController = require('../../controllers/admin/competition.controller.js');
const router = express.Router();
const { createCompetition, updateCompetition } = require('../../validations/competition.validation');
const multer = require('multer');

const upload = multer({limits: {fileSize: 10*1024*1024}});
/**
 * Load user when API with userId route parameter is hit
 */



router.param('id', competitionController.load);

router.route('/updateImageUrls')
  .get(competitionController.updateUrl);
router
  .route('/')
  .get(competitionController.list)

  .post(authorize(ADMIN), [upload.single('picture'),validate(createCompetition)], competitionController.create);

router
  .route('/:id')
  .get(competitionController.get)
  .patch(authorize(ADMIN), [upload.single('picture'),validate(updateCompetition)], competitionController.update)
  .delete(authorize(ADMIN), competitionController.remove);
router
  .route('/:id/events')
  .get(eventController.list);



module.exports = router;
