const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');

exports.load = async (req, res, next, id) => {
  try {
    const campaignService = req.app.get('container').get('campaignService');
    const campaign = await campaignService.findById(id);
    if (!campaign) {
      return next(new APIError({ message: "Campaign does not exists", status: httpStatus.NOT_FOUND }))
    }
    Object.assign({}, req.locals, { campaign})
    return next();
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res) => res.json(req.locals.campaign);



exports.list = async (req, res, next) => {
  try {
    const campaignService = req.app.get('container').get('campaignService');
    const paginatedCampaigns = await campaignService.paginate(req.filterParams, req.pagingParams);
    res.json(paginatedCampaigns);
  } catch (error) {
    next(error);
  }
}
