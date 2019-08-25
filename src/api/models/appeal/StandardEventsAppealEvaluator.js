const { uniqBy, flatten } = require('lodash');

const EventsAppealEvaluator = require('./EventsAppealEvaluator');

const SPORT_WEIGHT = 1;
const COMPETITION_WEIGHT = 1;
const COMPETITOR_WEIGHT = 1;

const defaultOptions = {
  competitorIdKey: "_id",
  competitionIdKey: "_id",
  sportIdKey: "_id",
  eventIdKey: "_id",
  appealValueKey: "appealValue"
};
class StandardEventsAppealEvaluator extends EventsAppealEvaluator {



  constructor(events = [], options = {}) {
    super(events);
    this.options = { ...defaultOptions, ...options };

    this.sports = this.getAllSports();
    this.competitions = this.getAllCompetitions();
    this.competitors = this.getAllCompetitors();

    this.sportAppeals = new Map();
    this.competitionAppeals = new Map();
    this.competitorAppeals =  new Map();
    this.eventAppealMap = new Map();



    for (let sport of this.sports) {
      this.sportAppeals.set(sport[this.options.sportIdKey], sport[this.options.appealValueKey]);
    }
    for (let competitor of this.competitors) {
      this.competitorAppeals.set(competitor[this.options.competitorIdKey], competitor[this.options.appealValueKey]);
    }
    for (let competition of this.competitions) {
      this.competitionAppeals.set(competition[this.options.competitionIdKey], competition[this.options.appealValueKey]);
    }

  }

  getAllSports() {
    return uniqBy(this.events.map(e => e.sport), this.options.sportIdKey);
  }
  getAllCompetitions() {
    return uniqBy(this.events.map(e => e.competition), this.options.competitionIdKey);
  }

  getAllCompetitors() {
    const competitors = this.events
        .filter(event => event.competitors)
        .map(event => event.competitors.map(c => c.competitor));

    const flattened = flatten(competitors);
    return uniqBy(flattened, this.options.competitorIdKey);
  }

  // Media aritmetica
  competitorMean() {
    let sum = 0;
    for (let [key, value] of this.competitorAppeals) {
      sum += value;
    }
    return sum / this.competitorAppeals.size;

  }
  evaluateEventCompetitorAppeal(event) {
    let appeal = 0;

    if (event.competitors && event.competitors.length > 0) {
      appeal = event.competitors.reduce((acc, record) => {
        return acc + this.competitorAppeals.get(record.competitor[this.options.competitorIdKey]);
      }, 0) / event.competitors.length;
    } else {
      let sum = 0;
      for (let [key, value] of this.competitorAppeals) {
        sum += value;
      }
      appeal = this.competitorMean()
    }

    return appeal;
  }

  evaluateEvent(event) {

    const sportAppeal = (SPORT_WEIGHT * this.sportAppeals.get(event.sport[this.options.sportIdKey])) || 0;
    const competitionAppeal = (COMPETITION_WEIGHT
        * this.competitionAppeals.get(event.competition[this.options.competitionIdKey])) || 0;
    const competitorAppeal = (COMPETITOR_WEIGHT * this.evaluateEventCompetitorAppeal(event)) || 0;


    const appeal = sportAppeal + competitorAppeal + competitionAppeal;
    return appeal;
  }
  evaluate() {


    for (let event of this.events) {

      this.eventAppealMap.set(
          event[this.options.eventIdKey],
          event.appeal ? event.appeal.value : this.evaluateEvent(event)
      )
    }
    return this.eventAppealMap;

  }

  getSortedEvents() {
    if (this.eventAppealMap.size === 0) {
      this.evaluate();
    }
    return this.events
        .sort((a, b) => this.eventAppealMap.get(b[this.options.eventIdKey]) - this.eventAppealMap.get(a[this.options.eventIdKey]));
  }
}


module.exports = StandardEventsAppealEvaluator;
