/**
 * Classe astratta
 */
class EventsAppealEvaluator {

  constructor(events = []) {
    if (events.length === 0) {
      throw new Error("Il parametro eventi è richiesto: " + typeof events + " ricevuto.");
    }

    if (events.length > 0) {
      const event = events[0];
      const hasCompetitors = event.competitors && event.competitors.length > 0;
      const competitorsOk = hasCompetitors ? event.competitors[0].competitor && event.competitors[0].competitor.id : true;
      const competitionOK = event.competition && event.competition.id;
      const sportOk = event.sport && event.sport.id;

      if(!competitionOK || !competitorsOk || !sportOk) {
       throw new Error("L'evento non rispetta i parametri richiesti");
      }
    }
    this.events = events
  }


  getSortedEvents() {
    throw new Error('Devi implementare questo metodo.');
  }
  /**
   * Restituisce
   * @param events Array
   * @return appeals Object, un oggetto con le entità come campi
   * Le entità sono a loro volta oggetto con gli id come chiave e l'appeal come valore
   */
  evaluate() {
    throw new Error('Devi implementare questo metodo.');
  }
}


module.exports = EventsAppealEvaluator;

