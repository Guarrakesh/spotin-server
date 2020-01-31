const express = require('express');

const campaignController = require('../../controllers/admin/campaign.controller');

const { authorize, ADMIN } = require('../../middlewares/auth');
const { filterRestQuery } = require('../../middlewares/restParser');

const router = express.Router();

router.param('id', campaignController.load);

router
    .route('/')
    .get(authorize(ADMIN), filterRestQuery, campaignController.list)
    .post(authorize(ADMIN), campaignController.create);
;

router
  .route('/:id')
  .get(authorize(ADMIN), campaignController.get);


module.exports = router;
