const BaseMongoService = require('./BaseMongoService');
const User = require('../models/user.model');
class UserService extends BaseMongoService  {

  constructor(reservationService) {
    super(User);
  }

  getVisitedBusinesses() {
    return [
        "saaaa"
    ]
  }
}

exports.UserService = UserService;
