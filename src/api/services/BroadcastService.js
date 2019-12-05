const BaseMongoService = require('./BaseMongoService');
const {Broadcast} = require('../models/broadcast.model');

class BroadcastService extends BaseMongoService {

  constructor(props) {
    super(Broadcast);
  }


}

exports.BroadcastService = BroadcastService;
