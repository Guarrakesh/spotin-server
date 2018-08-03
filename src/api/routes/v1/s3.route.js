const express = require('express');
const controller = require('../../controllers/s3.controller');


const router = express.Router();


router.get('/', (req, res) => res.send("Ciao"));
router
  .route('/sign-url').get(controller.signUrl);


module.exports = router;
