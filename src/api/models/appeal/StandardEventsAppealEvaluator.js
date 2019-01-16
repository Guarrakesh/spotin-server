const { uniqBy, flatten } = require('lodash');

const EventsAppealEvaluator = require('./EventsAppealEvaluator');

const SPORT_WEIGHT = 1;
const COMPETITION_WEIGHT = 1;
const COMPETITOR_WEIGHT = 1;

class StandardEventsAppealEvaluator extends EventsAppealEvaluator {



  constructor(props) {
    super(props);

    this.sports = this.getAllSports();
    this.competitions = this.getAllCompetitions();
    this.competitors = this.getAllCompetitors();

    this.sportAppeals = new Map();
    this.competitionAppeals = new Map();
    this.competitorAppeals =  new Map();
    this.eventAppealMap = new Map();

    this.sortedEvents = [];

    for (let sport of this.sports) {
      this.sportAppeals.set(sport.id, sport.appealValue);
    }
    for (let competitor of this.competitors) {
      this.competitorAppeals.set(competitor.id, competitor.appealValue);
    }
    for (let competition of this.competitions) {
      this.competitionAppeals.set(competition.id, competition.appealValue);
    }

  }

  getAllSports() {
    return uniqBy(this.events.map(e => e.sport), 'id');
  }
  getAllCompetitions() {
    return uniqBy(this.events.map(e => e.competition), 'id');
  }

  getAllCompetitors() {
    const competitors = this.events
        .filter(event => event.competitors)
        .map(event => event.competitors);

    const flattened = flatten(competitors);
    return uniqBy(flattened, 'id');
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
      appeal = event.competitors.reduce((acc, competitor) => {
        return acc + this.competitorAppeals.get(competitor.id);
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

    const sportAppeal = SPORT_WEIGHT * this.sportAppeals.get(event.sport.id);
    const competitionAppeal = COMPETITION_WEIGHT * this.competitionAppeals.get(event.competition.id);
    const competitorAppeal = COMPETITOR_WEIGHT * this.evaluateEventCompetitorAppeal(event);


    return sportAppeal + competitorAppeal + competitionAppeal;
  }
  evaluate() {


    for (let event of this.events) {
      this.eventAppealMap.set(event.id, this.evaluateEvent(event))
    }

    for (var [key, value] of this.eventAppealMap) {
      this.sortedEvents.push([key, value]);
    }
    this.sortedEvents.sort((a,b) => -1 * (a[1] - b[1]));

    return this.eventAppealMap;

  }

  getSortedEvents() {
    if (this.sortedEvents.length === 0 && this.eventAppealMap.size === 0) {
      this.evaluate();
    }
    return this.sortedEvents;
  }
}


module.exports = StandardEventsAppealEvaluator;