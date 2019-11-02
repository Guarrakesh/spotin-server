const BaseMongoService = require('./BaseMongoService');
const User = require('../models/user.model');


class UserService extends BaseMongoService  {

  constructor(reservationService) {
    super(User);
  }


  async addReservation(user, reservation) {
    return await this.update(user.id, {
      $addToSet: { reservations: reservation.id }
    }, { new: true });
  }
}

exports.UserService = UserService;
