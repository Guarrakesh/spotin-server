const BaseMongoService = require('./BaseMongoService');
const { Business } = require('../models/business.model');

class BusinessService extends BaseMongoService {

  constructor(props) {
    super(Business);
  }

  async takeSpotCoins(id, amount) {
    return await this.model.findOneAndUpdate({_id: id }, { $inc: { spotCoins: -amount }});
  }

  async addSpotCoins(id, amount) {
    return await this.model.findOneAndUpdate({_id: id }, { $inc: { spotCoins: amount }});
  }

}

exports.BusinessService = BusinessService;
