const express = require('express');
const mongoose = require('mongoose');
const controller = require('../../controllers/v1/broadcastreview.controller');
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
  if (req.body && req.body.userId && req.body.reservationId && loggedUser.id.toString() === req.body.userId) {
    const { userId, reservationId } = req.body;
    const broadcast = await Broadcast.findOne({
      'reservations._id': mongoose.Types.ObjectId(reservationId),
      reservations: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(reservationId),
          user:mongoose.Types.ObjectId(userId),
          review: { $exists: false }
        }
      }
    });
    return !!broadcast;

  }
  return false;
};

router
    .route('/')

    .post(validate(createValidation), authorize(LOGGED_USER, ownerCheck), controller.create);
router
    .route('/:id')
    .get(authorize(LOGGED_USER), controller.get);


module.exports = router;
