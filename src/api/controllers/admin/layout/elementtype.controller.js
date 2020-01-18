const { handler: errorHandler } = require('../../../middlewares/error');

exports.load = async(req, res, next, id) => {
  try {
    elementTypeService = req.app.get('container').get('layoutElementService');
    req.locals.elementType = elementTypeService.getLayoutElementTypeById(id);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};


exports.list = async(req, res, next) => {
  try {
    elementTypeService = req.app.get('container').get('layoutElementService');
    const elementTypes = await elementTypeService.getLayoutElementTypes();
    res.json({
      docs: elementTypes,
      total: elementTypes.length,
      limit: 9999,
    });
  } catch (error) {
    next(error);
  }
};


exports.get = async(req, res, next) => {
  try {
     const { elementType } = req.locals;
     res.json(elementType);
  } catch (e) {
    next(e);
  }
};
