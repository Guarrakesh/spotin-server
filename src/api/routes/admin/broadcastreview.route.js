const express = require('express');
const controller = require('../../controllers/admin/broadcastreview.controller');
const validate = require('express-validation');
const { authorize, ADMIN } = require('../../middlewares/auth');

const router = express.Router();
router.param('id', controller.load);

router
  .route('/')
  .get(authorize(ADMIN), controller.list);
router
  .route('/:id')
  .get(authorize(ADMIN), controller.get);


module.exports = router;
