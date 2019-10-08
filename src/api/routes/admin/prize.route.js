const express = require('express');
const prizeController = require('../../controllers/admin/prize.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const { filterRestQuery } = require('../../middlewares/restParser');
const multer = require('multer');

const upload = multer();

const router = express.Router();

router.param('id', prizeController.load);
router
    .route('/')
    .get(authorize(ADMIN), filterRestQuery, prizeController.list)
    .post(authorize(ADMIN), [upload.single('imageFile')], prizeController.create);

router
    .route('/:id')
    .get(authorize(ADMIN), prizeController.get)
    .delete(authorize(ADMIN), prizeController.remove);
module.exports = router;
