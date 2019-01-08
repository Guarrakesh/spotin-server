
const { Competition } = require('../models/competition.model');
const { Sport } = require('../models/sport.model');
const faker = require('faker');
faker.locale = "it";
async function load(Factory, factory) {


  Factory.define(Competition, async  => {

    return {
      name: faker.name.firstName(),
      active: true,
      duration: faker.random.number({min: 30, max: 300}),
      appealValue: faker.random.number({min: 0, max: 1, precision: 0.01}),
      sport: async (faker) => {
        return (await factory(Sport).create())._id
      },
      country: faker.address.country(),
      competitorsHaveLogo: faker.random.boolean(),

      // user: (faker) => {
      //   factory(User).create()._id,
      // }
    }

  });
}
module.exports = load;