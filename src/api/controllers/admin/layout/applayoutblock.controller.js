const { handler: errorHandler } = require('../../../middlewares/error');
const httpStatus = require('http-status');
exports.load = async(req, res, next, id) => {
  try {
    const layoutElementService = req.app.get('container').get('layoutElementService');
    req.locals.appLayoutBlock = layoutElementService.getAppLayoutBlockById(id);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};


exports.list = async(req, res, next) => {
  try {
    const layoutElementService = req.app.get('container').get('layoutElementService');
    const layoutBlocks = await layoutElementService.getAppLayoutBlocks();
    res.json({
      docs: layoutBlocks,
      total: layoutBlocks.length,
      limit: 9999,
    });
  } catch (error) {
    next(error);
  }
};

exports.get = async(req, res, next) => {
  try {
    const { appLayoutBlock } = req.locals;
    res.json(appLayoutBlock);
  } catch (e) {
    next(e);
  }
};

exports.create = async(req, res, next) => {
  try {

    const layoutElementService = req.app.get('container').get('layoutElementService');
    const validation = await layoutElementService.createAppLayoutBlock(req.body);
    if (validation.result) {
      res.json(validation.layoutBlock)
    } else {
      res.status(httpStatus.BAD_REQUEST);
      res.json(validation);
    }
  } catch (e) {
    next(e);
  }
};

exports.update = async(req, res, next) => {
  try {
    const updated = Object.assign(req.locals.appLayoutBlock, req.body);
    const layoutElementService = req.app.get('container').get('layoutElementService');

    const response = await layoutElementService.updateAppLayoutBlock(updated).result;
    if (response.result) {
      res.json(updated);
    } else {
      res.json(response);
    }
  } catch (e) {
    next(e);
  }
}
