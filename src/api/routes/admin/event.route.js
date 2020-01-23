const express = require('express');

const eventController = require('../../controllers/admin/event.controller');

const { authorize, ADMIN } = require('../../middlewares/auth');
const { filterRestQuery } = require('../../middlewares/restParser');


const router = express.Router();


router.param('id', eventController.load);
router
    .route('/')
    .get(authorize(ADMIN), filterRestQuery, eventController.list)
    .post(authorize(ADMIN), eventController.create);

router
    .route('/:id')
    .get(authorize(ADMIN), eventController.get)
    .patch(authorize(ADMIN), eventController.update)
    .delete(authorize(ADMIN), eventController.remove);

module.exports = router;
