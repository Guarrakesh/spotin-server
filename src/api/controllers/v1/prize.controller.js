const httpStatus = require('http-status');
const ApiError = require('../../utils/APIError');
const {PrizeService} = require('../../services/PrizeService');

const prizeService = new PrizeService();

exports.list = async (req, res, next) => {
  res.json(await prizeService.findAndPaginate({}, { _end: 20, _start: 0}));
};

exports.claim = async (req, res, next) => {

};
