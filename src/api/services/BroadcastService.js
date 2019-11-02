const BaseMongoService = require('./BaseMongoService');
const { Broadcast } = require('../models/broadcast.model');

class BroadcastService extends BaseMongoService {

  constructor() {
    super(Broadcast);
  }
  async setCheer(broadcast, cheerFor) {
    const operations = {};
    const event = await broadcast.getEvent();
    if (cheerFor === "__home__" && event.competitors.length > 0) {
      operations.$inc = { 'cheers.home': 1, 'cheers.total': 1 };
    } else if (cheerFor === "__guest__" && event.competitors.length > 0) {
      operations.$inc = { 'cheers.guest': 1, 'cheers.total': 1 };
    } else {
      operations.$push = { 'cheers.other': cheerFor };
      operations.$inc = { 'cheers.total': 1 }
    }

    return await this.update(broadcast.id, operations, {
      new: true
    });
  }
}


exports.BroadcastService = BroadcastService;
