const faker = require('faker');
const { Reservation } = require('../models/reservation.model');
async function load(Factory) {
  Factory.define(Reservation, async () => {
    peopleNum: faker.random.number({min: 1, max: 20})
  });
}

module.exports = load;
