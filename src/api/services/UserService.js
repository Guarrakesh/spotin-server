const BaseMongoService = require('./BaseMongoService');
const User = require('../models/user.model');
const { Broadcast} = require('../models/broadcast.model');

class UserService extends BaseMongoService  {

  constructor(broadcastService, businessService) {
    super(User);
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

  async takeSpotCoins(id, amount) {
    return await this.model.findOneAndUpdate({_id: id }, { $inc: { spotCoins: -amount }});
  }

  async addSpotCoins(id, amount) {
    return await this.model.findOneAndUpdate({_id: id }, { $inc: { spotCoins: amount }});
  }
}

exports.UserService = UserService;
