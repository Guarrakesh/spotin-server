const BaseMongoService = require('./BaseMongoService');
const { Business } = require('../models/business.model');

class BusinessService extends BaseMongoService {

  constructor(props) {
    super(Business);
  }



}

exports.BusinessService = BusinessService;
