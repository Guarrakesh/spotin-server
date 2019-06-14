const express = require('express');
const { authorize, ADMIN } = require('../../middlewares/auth');
const router = express.Router();
const controller = require('../../controllers/admin/setting.controller');
/**
 * Load user when API with userId route parameter is hit
 */


router.param('id', controller.load);

router
  .route('/')
  .get(controller.list)
  .post(authorize(ADMIN), controller.create);


router
  .route('/:id')
  .get(controller.get)
  .patch(authorize(ADMIN), controller.update)
  .delete(authorize(ADMIN), controller.remove);


/*
router
  .route('/:id/broadcasts')
    .get(broadcastController.list);
*/




module.exports = router;
