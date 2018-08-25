

const express = require('express');
const router = express.Router();


const controller = require('../../controllers/broadcast.controller');


router.param('id', controller.load);

router
  .route('/')
  .get(controller.list)

;

router
  .route('/:id')
  .get(controller.get);




module.exports = router;
