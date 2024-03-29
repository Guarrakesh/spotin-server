// @flow
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { ObjectId } = require('bson');
const mongoosePaginate = require('mongoose-paginate');
const {Competition} = require('./competition.model');
const {Competitor} = require('./competitor.model');
const {Sport} = require('./sport.model');
const AppealEvaluator = require('./appeal/StandardEventsAppealEvaluator');
const sportEventSchema = new mongoose.Schema({

  sport: {
    type: mongoose.Schema.ObjectId,
    ref: "Sport"
  },
  competition: {
    type: mongoose.Schema.ObjectId,
    ref: "Competition"
  },
  competitors: [
    new mongoose.Schema({
      _id: { type: mongoose.Schema.ObjectId, ref: "Competitor" },
      name: String,
      competitor: { type: mongoose.Schema.ObjectId,ref: "Competitor"}

    })
  ],

  name: {

    type: String,
    trim: true,
    maxlength: 128

  },
  description: {
    type: String,
    trim: true
  },
  start_at: {
    type: Date,
    required: true
  },
  //Il prezzo (in spot) dell'evento
  // Deprecato
  spots: {
    type: Number,
    default: 0
  },
  providers: [String],
  appeal: mongoose.Schema({
    value: Number,
    calculatedAt: Date,
  }, { _id: false, timestamps: false }),
  appealValue: Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });



sportEventSchema.pre('save', async function(next) {
  try {
    let appealValue = 0;
    //Check if sport exists
    const sport = await Sport.findById(this.sport.toString());
    const competition = await Competition.findById(this.competition.toString());
    appealValue = sport.appealValue + competition.appealValue;
    const Error = (message) => (new APIError({
      message,
      status: httpStatus.BAD_REQUEST
    }));

    if (!sport) {
      next(Error("Lo sport specificato non esiste."))
    }
    if (!competition) {
      next(Error("La competizione specificata non esiste."));
    }

    const ids = this.competitors.map(comp => comp.competitor);

    const competitors = await Competitor.find({_id: {$in: ids}});
    if (!competitors || competitors.length !== this.competitors.length) {
      next(Error("Uno o più sfidanti specificati non esistono."));
    }

    const evaluator = new AppealEvaluator([this]);
    this.appeal = {
      value: evaluator.evaluateEvent(this),
      calculatedAt: Date.now(),
    };

    next();
  } catch (e) {
    next(e);
  }
});

/**
 * @memberOf SportEvent
 * @param user
 */
sportEventSchema.methods.transform = function(user = undefined) {
  const transformed = {};
  const fields = ['providers','sport','competition','_id','competitors', 'name','description', 'start_at', 'spots', 'created_at', 'updated_at'];
  fields.forEach((field) => {
    if (field === "competitors" && typeof this.competitors === "object") {
      transformed[field] = this.competitors.map(competitor => {
        if (typeof competitor === "object" && competitor.competitor && typeof competitor.competitor === "object") {
          return {

            competitor: competitor.competitor._id,
            name: competitor.competitor.name,
            color: competitor.competitor.color,
            _links: {
              image_versions: competitor.competitor.image_versions
            }
          }
        } else {
          return competitor;
        }
      })
    } else {
      transformed[field] = this[field];
    }
  });
  //Check is SportEvent is favorited by user
  if (user) {

    transformed['isUserFavorite'] = user.favorite_events && user.favorite_events.find(e => e.toString() === this._id.toString());
  }
  //TODO: Cercare nei preferiti dell'utente
  return transformed;
};


sportEventSchema.methods.getOverlaps = function(event) {

  const broadcastableEventStart = this.start_at.getTime();
  const broadcastableEventEnd = broadcastableEventStart + (this.sport.duration * 60 * 1000);

  const eventToBroadcastStart = event.start_at.getTime();;
  const eventToBroadcastEnd =  eventToBroadcastStart + event.sport.duration * (60*1000);


  return (
      (broadcastableEventStart <= eventToBroadcastEnd && broadcastableEventStart >= eventToBroadcastStart)
      ||
      (broadcastableEventEnd >= eventToBroadcastStart && broadcastableEventEnd <= eventToBroadcastEnd));
};
sportEventSchema.methods.getCompetition = async function () {
  return ObjectId.isValid(this.competition)
      ? await Competition.findById(this.competition)
      :  this.competition;
};
sportEventSchema.methods.getCompetitors = async function () {
  if (this.competitors.length > 0) {
    return ObjectId.isValid(this.competitors[0].competitor)
        ? await Competitor.find({_id: { $in: this.competitors.map(c => c.competitor)}})
        : this.competitors.map(c => c.competitor);
  }
  return null;
};
sportEventSchema.methods.getSport = async function () {
  return ObjectId.isValid(this.sport)
      ? await Sport.findById(this.sport)
      : this.sport;
};
sportEventSchema.statics = {


  async getWeekEvents(competitionId) {
    try {
      let events;
      if (mongoose.Types.ObjectId.isValid(competitionId)) {
        let startDate = Date.now();
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 8); //Week
        events = await this.find({
          competition: {_id: competitionId},
          start_at: { $gte: startDate, $lt: endDate}

        }).lean().exec();

      }


      if (events) {
        return events;
      }
      throw new APIError({
        message: "No events found",
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  }
}

sportEventSchema.plugin(mongoosePaginate);
exports.sportEventSchema = sportEventSchema;
exports.SportEvent = mongoose.model('SportEvent', sportEventSchema, 'sport_events');
