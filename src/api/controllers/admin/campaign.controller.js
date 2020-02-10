const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');
const { ObjectId } = require('bson');
exports.load = async (req, res, next, id) => {
  try {
    const campaignService = req.app.get('container').get('campaignService');
    const campaign = await campaignService.findById(id);
    if (!campaign) {
      return next(new APIError({ message: "Campaign does not exists", status: httpStatus.NOT_FOUND }))
    }
    req.locals = { ...(req.locals || {}), campaign } ;

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


exports.create = async(req, res, next) => {
  try {


    const campaignService = req.app.get('container').get('campaignService');
    const eventService = req.app.get('container').get('eventService');
    const rewardRules = await Promise.all(req.body.rewardRules.map(async rule => {
      if (ObjectId.isValid(rule.eventName)) {
        const event = await eventService.findById(rule.eventName);
        return { ...rule, eventName: event.slug }
      }
      return rule;
    }));


    const result = campaignService.create({...req.body, rewardRules: rewardRules });

    res.status(httpStatus.CREATED);
    res.json(result);

  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { campaign } = req.locals;

    const campaignService = req.app.get('container').get('campaignService');
    await campaignService.remove(campaign.id);
    res.status(200).end();

  } catch (err) {
    return next(err);
  }
};
