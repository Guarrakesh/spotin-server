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
    const { user } = req;
    if (!user)
      throw new ApiError({status: 401});
    const { broadcast } = req.body;
    const reservation = new Reservation({
      user: user._id,
      broadcast: broadcast,
      created_at: (new Date()).toISOString()
    });

    await Broadcast.update({_id: broadcast},
    { $push: {reservations: reservation}});
    await User.update({_id: user._id},
    { $push: {reservations: new mongoose.mongo.ObjectId(broadcast)}}, function(err, res){
    });

    res.status = httpStatus.CREATED;
    res.json(reservation);

  } catch (e) {
    next(e);
  }
}
