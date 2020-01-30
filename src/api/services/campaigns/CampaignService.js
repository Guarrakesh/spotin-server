const BaseMongoService = require('../BaseMongoService');
const {Campaign} = require('../../models/campaign/campaign.model');

class CampaignService extends BaseMongoService {
  constructor() {
    super(Campaign);
  }

}

exports.CampaignService = CampaignService;
