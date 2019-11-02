const { ReservationService } = require('../../../services/ReservationService');
const { Types } = require('mongoose')
const { expect } = require('chai');
const sinon = require('sinon');

let sandbox;


const fakeSetCheer = async (broadcast, cheerFor) => {
  broadcast.cheers = { guest: 1, total: 1 };
  Promise.resolve(broadcast);
};
const fakeCreate = async (atts) => Promise.resolve(({
  ...atts,
  id: Types.ObjectId().toString(),
}));

const fakeBroadcastService = {
  setCheer: fakeSetCheer,
};
const fakeUserService = {
  addReservation: () => Promise.resolve(),
};
const fakeBroadcast = {
  getEvent: async () => Promise.resolve({ name: "Bla -  bla "}),
  getBusiness: async () => Promise.resolve({ name: "A business"}),
  id: Types.ObjectId().toString(),
};

const fakeUser = {
  id: Types.ObjectId().toString(),
  addReservation: async (user, res) => Promise.resolve({ reservations: [res]})
};
const reservationService = new ReservationService(fakeBroadcastService, fakeUserService);
describe('Reservation Service', () => {

  describe('User CheckIn', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(reservationService, 'create').callsFake(fakeCreate);

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return reservation', async () => {
      sandbox.stub(reservationService, 'find').callsFake(() => Promise.resolve(undefined) );
      const reservation = await reservationService.checkIn(fakeUser, fakeBroadcast, {
        peopleNum: 12,
      });

      expect(reservation).to.be.an('object');
      expect(reservation.peopleNum).to.equal(12);
      Promise.resolve();
    });

    it('should ')
  })
});
