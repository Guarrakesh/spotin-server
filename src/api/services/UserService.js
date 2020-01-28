const BaseMongoService = require('./BaseMongoService');
const User = require('../models/user.model');
const { Broadcast} = require('../models/broadcast.model');

class UserService extends BaseMongoService  {

  constructor(reservationService, broadcastService, businessService) {
    super(User);
    this.reservationService = reservationService;
    this.broadcastService = broadcastService;
    this.businessService = businessService;
  }

  async getVisitedBusinesses(user, include) {


    const businessIds = await Promise.all(user.reservations.map(async res => {
      const broadcast = await this.broadcastService.findOne({ 'reservations._id': res });
      return broadcast.business;
    }));
    return await this.businessService.find({_id: {$in: businessIds }}, include || {});
  }

  async removeFcmTokens(user, tokens) {
    return await this.update(user.id, {
      $pull: { 'fcmTokens' : {  token: { $in: tokens } }}
      });
  }
}

exports.UserService = UserService;
