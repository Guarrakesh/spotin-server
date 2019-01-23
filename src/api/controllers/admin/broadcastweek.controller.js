const moment = require('moment');
const { Business } = require('../../models/business.model');
const { Broadcast } = require('../../models/broadcast.model');
const EventsAppealEvaluator = require('../../models/appeal/StandardEventsAppealEvaluator');


exports.get = async (req, res, next) => {
  const business = await Business.findById("5baa16b98c7457001ea41718");

  const endDate =  moment().add(1,'week').toDate();

  const events = await business.getBroadcastableEvents(moment().add(1,'day').toDate(), endDate);
  const evaluator = new EventsAppealEvaluator(events);


  const evaluatedEventsMap = evaluator.evaluate();

  const evaluatedEvents = events.map(event => {
    return {
      appeal: evaluatedEventsMap.get(event.id),
      name: event.name,
      start_at: event.start_at,
      competition: event.competition.name,
      competitors: event.competitors,
    }
  }).sort((a,b) => b.appeal - a.appeal)

  res.json(evaluatedEvents);


};



