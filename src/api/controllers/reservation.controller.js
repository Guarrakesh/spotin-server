const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../utils/APIError');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');
const { Reservation } = require('../models/reservation.model');
const { Broadcast } = require('../models/broadcast.model');
const User = require('../models/user.model');


exports.create = async (req, res, next) => {
  try {
    const {loggedUser} = req.locals;
    if (!loggedUser)
      throw new ApiError({status: 401});
    const { broadcast } = req.body;
    const reservation = new Reservation({
      user: loggedUser._id,
      broadcast: broadcast,
      created_at: (new Date()).toISOString()
    });

    await Broadcast.update({_id: broadcast},
    { $push: {reservations: reservation}});
    await User.update({_id: loggedUser._id},
    { $push: {reservations: new mongoose.mongo.ObjectId(broadcast)}}, function(err, res){
      console.log(err, res);
    });

    res.status = httpStatus.CREATED;
    res.json(reservation);

  } catch (e) {
    next(e);
  }
}
