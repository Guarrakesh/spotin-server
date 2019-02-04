const StandardEventsAppealEvaluator = require('../../models/appeal/StandardEventsAppealEvaluator');
const chai = require('chai');

const expect = chai.expect;

const events = [
  {
    id: 11,
    sport: { id: 1, appealValue: 0.2 },
    competition: { id: 1, appealValue: 0.5}
  },
  {
    id: 22,
    sport: { id: 2, appealValue: 0.5 },
    competition: { id: 2, appealValue: 0.2 },
    competitors: [
      { competitor: { id: 1, appealValue: 0.5 }  },
      { competitor: { id: 2, appealValue: 0.2 }  }
    ]
  },
  {
    id: 33,
    sport: { id: 5, appealValue: 0.2 },
    competitors: [
      { competitor: { id: 3, appealValue: 0.8 } },
      { competitor: { id: 4, appealValue: 0.42 }  }
    ],
    competition: { id: 3, appealValue: 0.8 }
  },
  {
    id: 44,
    sport: { id: 10 , appealValue: 0.99 },
    competition: { id: 8 , appealValue: 0.99}
  },
];

describe('StandardEventsAppealEvaluator', () => {
  it('Should throw error if no events passed', () => {
    expect(() => new StandardEventsAppealEvaluator()).to.throw(Error);
  });

  it('Should throw error if event(s) is not as expected', () => {
    expect(() => new StandardEventsAppealEvaluator([{ sport: undefined, competition: undefined }])).to.throw(Error, "L'evento non rispetta i parametri richiesti");
  });
  it('Should instantiate all the Maps', () => {
    const evaluator = new StandardEventsAppealEvaluator(events);
    expect(evaluator.sportAppeals.constructor.name).to.be.equal("Map");
    expect(evaluator.sportAppeals.get(1)).to.be.equal(0.2);

    expect(evaluator.competitionAppeals.constructor.name).to.be.equal("Map");
    expect(evaluator.competitionAppeals.get(2)).to.be.equal(0.2);

    expect(evaluator.competitorAppeals.constructor.name).to.be.equal("Map");
    expect(evaluator.competitorAppeals.get(4)).to.be.equal(0.42);
  });
  it("should evaluate competitor mean", () => {
    const evaluator = new StandardEventsAppealEvaluator(events);
    expect(evaluator.competitorMean()).to.be.equal(0.48);

  });
  it('Should evaluate single event', () => {
    const evaluator = new StandardEventsAppealEvaluator(events);
    expect(evaluator.evaluateEvent(events[2])).to.be.equal(1.61);
  })
  it('Should evaluate events', () => {
    const evaluator = new StandardEventsAppealEvaluator(events);
    const evaluatedEvents = evaluator.evaluate();
    expect(evaluatedEvents.size).to.be.equal(4);
  });


});