const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/sportevent.controller');
//const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */


router.param('sportId', controller.load);

 router
    .route('/')
      .get(controller.list);







module.exports = router;
