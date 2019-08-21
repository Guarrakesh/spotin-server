/**
 * Classe astratta
 */
class EventsAppealEvaluator {

  constructor(events = []) {
    if (events.length === 0) {
      throw new Error("Il parametro eventi è richiesto: " + typeof events + " ricevuto.");
    }

    for (const key in events) {
      const event = events[key];
      const hasCompetitors = event.competitors && event.competitors.length > 0;
      const competitorsOk = hasCompetitors ? event.competitors[0].competitor && event.competitors[0].competitor._id : true;
      const competitionOK = event.competition && event.competition._id;
      const sportOk = event.sport && event.sport._id;

      if(!competitionOK || !competitorsOk || !sportOk) {
       throw new Error("L'evento non rispetta i parametri richiesti: " + event);
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
   * Le entità sono a loro volta oggetto con gli._id come chiave e l'appeal come valore
   */
  evaluate() {
    throw new Error('Devi implementare questo metodo.');
  }
}


module.exports = EventsAppealEvaluator;

