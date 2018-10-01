const express = require('express');
const controller = require('../../controllers/v1/s3.controller.js');


const router = express.Router();


router.get('/', (req, res) => res.send("Ciao"));
router
  .route('/sign-url').get(controller.signUrl);


module.exports = router;
