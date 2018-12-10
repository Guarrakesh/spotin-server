const { Sport } = require('../models/sport.model');
const { Competition } = require('../models/competition.model');
const { SportEvent } = require('../models/sportevent.model');
const { Competitor } = require('../models/competitor.model');
const User = require('../models/user.model');


const analytics = (req, res, next) => {
  res.on('finish', async () => {
    if (req.locals && req.locals.loggedUser) {
      const {loggedUser} = req.locals;
      if (req.baseUrl === "/v1/competitions" && req.query.sport) {
        const sport = await Sport.findById(req.query.sport);
        if (!sport) return;
        const {nModified} = await User.update({_id: loggedUser._id, "sportHits.sport": req.query.sport},
          {$inc: {"sportHits.$.hits": 1}});
        if (nModified === 0) {
          await User.update({_id: loggedUser._id},
            {$addToSet: {sportHits: {sport: sport._id, name: sport.name, hits: 1}}});
        }
      } else if (req.baseUrl === "/v1/events" && req.query.competition) {
        const competition = await Competition.findById(req.query.competition);
        if (!competition) return;
        const {nModified} = await User.update({_id: loggedUser._id, "competitionHits.competition": req.query.competition},
          {$inc: {"competitionHits.$.hits": 1}});
        if (nModified === 0) {
          await User.update({_id: loggedUser._id},
            {$addToSet: {competitionHits: {competition: competition._id, name: competition.name, hits: 1}}});
        }
      } else if (req.baseUrl === "/v1/broadcasts" && req.query.event) {
        const event = await SportEvent.findById(req.query.event);
        for (let i=0; i < event.competitors.length; i++) {
          const competitor = await Competitor.findById(event.competitors[i].competitor);
          if (!competitor) continue;
          const {nModified} = await User.update({_id: loggedUser._id, "competitorHits.competitor": competitor._id},
            {$inc: {"competitorHits.$.hits": 1}});
          if (nModified === 0) {
            await User.update({_id: loggedUser._id},
              {$addToSet: {competitorHits: {competitor: competitor._id,
                name: competitor.isPerson ? competitor.full_name : competitor.name, hits: 1}}});
          }
        }



      }

    }
  });
  next();
};


module.exports = analytics;
