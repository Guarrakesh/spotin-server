const httpStatus = require('http-status');
const ApiError = require('../../utils/APIError');
const {PrizeService} = require('../../services/PrizeService');

const prizeService = new PrizeService();

exports.list = async (req, res, next) => {
  res.json(await prizeService.find());
};

exports.claim = async (req, res, next) => {

};