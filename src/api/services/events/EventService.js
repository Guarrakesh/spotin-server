const BaseMongoService = require('../BaseMongoService');
const { Event } = require('../../models/events/event.model');

class EventService extends BaseMongoService {
  constructor() {
    super(Event);
  }

}

exports.EventService = EventService;
