const moment = require('moment');

const { Business } = require('../../models/business.model');
const { Broadcast } = require('../../models/broadcast.model');
const EventsAppealEvaluator = require('../../models/appeal/StandardEventsAppealEvaluator');


exports.get = async (req, res, next) => {
  const business = await Business.findById("5baa16b98c7457001ea41718");

  const events = await business.getBroadcastableEvents(moment().add(1,'day').toDate(), moment().add(1,'week').toDate());
  const evaluator = new EventsAppealEvaluator(events);
  res.json(evaluator.getSortedEvents());


};



