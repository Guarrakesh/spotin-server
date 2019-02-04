const moment = require('moment');
const { Business } = require('../../models/business.model');
const { Broadcast } = require('../../models/broadcast.model');
const { BroadcastBundle } = require('../../models/broadcastbundle.model');
const EventsAppealEvaluator = require('../../models/appeal/StandardEventsAppealEvaluator');
const ApiError = require('../../utils/APIError');

exports.get = async (req, res, next) => {
  try {
    const business = await Business.findById("5baa16b98c7457001ea41718");

    const startDate = moment("2018-12-03").toISOString();
    const endDate = moment("2018-12-10").toISOString();

    const events = await business.getBroadcastableEvents(startDate, endDate);
    if (!events || events.length === 0) {
      return next(new ApiError({message: "Non ci sono eventi per questa settimana", status: 422, isPublic: true}));
    }
    const evaluator = new EventsAppealEvaluator(events);


    const evaluatedEventsMap = evaluator.evaluate();

    /*  const evaluatedEvents = events.map(event => {
        return {

          appeal: evaluatedEventsMap.get(event.id),
          name: event.name,
          start_at: event.start_at,
          competition: event.competition.name,
          competitors: event.competitors,
        }
      }).sort((a,b) => b.appeal - a.appeal);*/
    const sortedEvents = events.sort((a, b) => evaluatedEventsMap.get(b.id) - evaluatedEventsMap.get(a.id));
    const bundle = await BroadcastBundle.buildBundle(business, sortedEvents);
    res.json(bundle);
  } catch (e) {
    next(e);
  }


};



