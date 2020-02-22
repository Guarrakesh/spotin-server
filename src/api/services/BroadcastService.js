const BaseMongoService = require('./BaseMongoService');
const {Broadcast} = require('../models/broadcast.model');
const { SportEvent } = require('../models/sportevent.model');
class BroadcastService extends BaseMongoService {

  constructor(props) {
    super(Broadcast);
  }


  async setCheerFor(broadcast, cheerFor) {

    const event = await SportEvent.findById(broadcast.event)
    const operations = [];
    if (cheerFor) {
      if (cheerFor === "__home__" && event.competitors.length > 0) {
        operations.$inc = {'cheers.home': 1, 'cheers.total': 1};
      } else if (cheerFor === "__guest__" && event.competitors.length > 0) {
        operations.$inc = {'cheers.guest': 1, 'cheers.total': 1};
      } else {
        operations.$push = {'cheers.other': cheerFor};
        operations.$inc = {'cheers.total': 1}
      }

      return await this.model.findOneAndUpdate({_id: broadcast.id}, operations);
    }

  }
}

exports.BroadcastService = BroadcastService;
