// @flow
const { uniqBy, flatten } = require('lodash');
const EventsAppealEvaluator = require('./EventsAppealEvaluator');
const DEFAULT_SPORT_WEIGHT = 1;
const DEFAULT_COMPETITION_WEIGHT = 1;
const DEFAULT_COMPETITOR_WEIGHT = 1;
const DEFAULT_FAVORITE_COMPETITOR_WEIGHT = 4.1;
const DEFAULT_FAVORITE_SPORT_WEIGHT = 2;
const DEFAULT_FAVORITE_COMPETITION_WEIGHT = 2;

/* ====== TYPES ==========*/
// type AppealWeights = {
//   sportWeight: number;
//   competitionWeight: number;
//   competitorWeight: number;
//   favoriteCompetitorWeight: number;
//   favoriteSportWeight: number;
// }
//
// type EvaluatorOptions = {
//   appealWeights: AppealWeights;
//   [key: string]: any;
// }
// type BusinessType = {
//   id: string;
//   _id: string;
//   favoriteCompetitors: string[];
//   favoriteSports: strin[];
//   [key: string]: any;
// }

/* ======= DEFAULTS ========= */
const defaultAppealWeights = {
  sportWeight: DEFAULT_SPORT_WEIGHT,
  competitionWeight: DEFAULT_COMPETITION_WEIGHT,
  competitorWeight: DEFAULT_COMPETITOR_WEIGHT,
  favoriteCompetitorWeight: DEFAULT_FAVORITE_COMPETITOR_WEIGHT,
  favoriteSportWeight: DEFAULT_FAVORITE_SPORT_WEIGHT,
  favoriteCompetitionWeight: DEFAULT_FAVORITE_COMPETITION_WEIGHT,
};

const defaultOptions = {
  competitorIdKey: "id",
  competitionIdKey: "id",
  sportIdKey: "id",
  eventIdKey: "id",
  appealValueKey: "appealValue",
  appealWeights: defaultAppealWeights,
};

/**
 * Evaluator di appeal che prende in conto anche dei preferiti del locale
 * Funziona più o meno come quello Standard, ma se uno Sport/Competizione/Competitor dell'evento
 * in questione appartiene ai preferiti del locale, allora viene valutato con un peso maggiore (parametrizzato)
 *
 */
class BusinessBasedEventsAppealEvaluator extends EventsAppealEvaluator {

  weights;

  constructor(events, business, options) {
    super(events);

    this.business = business;
    this.options = { ...defaultOptions, ...options, appealWeights: { ...defaultAppealWeights, ...options.appealWeights } };

    this.weights = this.options.appealWeights;

    this.sports = this.getAllSports();
    this.competitions = this.getAllCompetitions();
    this.competitors = this.getAllCompetitors();

    this.sportAppeals = new Map();
    this.competitionAppeals = new Map();
    this.competitorAppeals =  new Map();
    this.eventAppealMap = new Map();


    console.log("Generating Bundle with Weights: ", this.weights);

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
    const favCompetitors = this.business.favoriteCompetitors || [];

    if (event.competitors && event.competitors.length > 0) {
      appeal = event.competitors.reduce((acc, record) => {
        const baseAppeal = this.competitorAppeals.get(record.competitor[this.options.competitorIdKey]);
        // Se il competitor è tra i preferiti del locale aumenta il peso
        if (favCompetitors.length > 0 && favCompetitors.find(a => a.toString() === record.competitor[this.options.competitorIdKey])) {
          return this.weights.favoriteCompetitorWeight * baseAppeal + acc;
        }
        return baseAppeal + acc;
        }, 0) / event.competitors.length;
    } else {
      let sum = 0;
      for (let [key, value] of this.competitorAppeals) {
        sum += value;
      }
      appeal = this.competitorMean()
    }

    return this.weights.competitorWeight *  appeal;
  }
  evaluateEventCompetitionAppeal(event) {
    const baseAppeal = this.competitionAppeals.get(event.competition[this.options.competitionIdKey]);
    const favCompetitions = this.business.favoriteCompetitions || [];


    if (favCompetitions.length > 0 && favCompetitions.find(a => a.toString() === event.competition[this.options.competitionIdKey])) {

      return baseAppeal * this.weights.competitionWeight * this.weights.favoriteCompetitionWeight;
    }
    return baseAppeal * this.weights.competitionWeight;
  }

  evaluateEventSportAppeal(event) {
    const baseSportAppeal = this.sportAppeals.get(event.sport[this.options.sportIdKey]);
    const favSports = this.business.favoriteSports || [];
    if (favSports.length > 0 && favSports.find(a => a.toString() === event.sport[this.options.sportIdKey])) {
      return baseSportAppeal * this.weights.sportWeight * this.weights.favoriteSportWeight;
    }
    return baseSportAppeal * this.weights.sportWeight;
  }
  evaluateEvent(event) {


    const sportAppeal = this.evaluateEventSportAppeal(event) || 0;
    const competitionAppeal = this.evaluateEventCompetitionAppeal(event) || 0;
    const competitorAppeal = this.evaluateEventCompetitorAppeal(event) || 0;

    return sportAppeal + competitorAppeal + competitionAppeal;
  }
  evaluate() {

    for (let event of this.events) {
      this.eventAppealMap.set(event[this.options.eventIdKey], this.evaluateEvent(event))
    }

    return this.eventAppealMap;

  }

}


module.exports = BusinessBasedEventsAppealEvaluator;