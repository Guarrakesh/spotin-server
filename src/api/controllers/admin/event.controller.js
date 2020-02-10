const { handler: errorHandler } = require('../../middlewares/error');
const httpStatus = require('http-status');


exports.load = async (req, res, next, id) => {
  try {
    eventService = req.app.get('container').get('eventService');
    req.locals = { event: await eventService.findById(id) };
    return next();
  } catch (error) {
    return errorHandler(error, res, res);
  }
}


exports.list = async(req, res, next) => {
  try {
    eventService = req.app.get('container').get('eventService');
    const paginatedEvents= await eventService.paginate(req.filterParams, req.pagingParams);
    res.json(paginatedEvents);
  } catch (error) {
    return next(error);
  }
};


exports.get = async(req, res, next) => {
  try {
    const { event } = req.locals;
    res.json(event);
  } catch (e) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { event } = req.locals;

    eventService = req.app.get('container').get('eventService');
    await eventService.remove(event.id);
    res.status(200).end();

  } catch (err) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    eventService = req.app.get('container').get('eventService');
    const created = await eventService.create(req.body);

    res.status = httpStatus.CREATED;
    res.json(created);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const eventService = req.app.get('container').get('eventService');
    const updatedEvent = Object.assign(req.locals.event, req.body);
    await eventService.update(updatedEvent.id, updatedEvent);

    res.json(updatedEvent);

  } catch (err) {
    return next(error);
  }

};
