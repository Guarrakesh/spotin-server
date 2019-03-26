const express = require('express');
const controller = require('../../controllers/admin/broadcastreview.controller');
const validate = require('express-validation');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');
const { create: createValidation } = require('../../validations/broadcastreview.validation');
const { Broadcast } = require('../../models/broadcast.model');
const router = express.Router();
router.param('id', controller.load);

/**
 * Controlla che il broadcast sia stato effettivamente prenotato dall'utente che sta recensendo
 * @param req
 * @param loggedUser
 * @returns {Promise<boolean>}
 */
const ownerCheck  = async (req, loggedUser) => {
  if (req.body && req.body.userId && req.body.broadcastId && loggedUser.id.toString() === req.body.userId) {
    const broadcast = await Broadcast.findOne({
      _id: req.body.broadcastId,
      reservations: { $elemMatch: { user: req.body.userId } }
    });
    return !!broadcast;

  }
  return false;
};

router
    .route('/')

    .post(authorize(LOGGED_USER, ownerCheck), validate(createValidation), controller.create);
router
    .route('/:id')
    .get(authorize(LOGGED_USER), controller.get);


module.exports = router;
