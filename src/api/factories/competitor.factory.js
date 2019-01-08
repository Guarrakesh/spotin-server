
const { Competitor } = require('../models/competitor.model');
const { Sport } = require('../models/sport.model');
const faker = require('faker');
faker.locale = "it";
function load(Factory, factory) {


  Factory.define(Sport, async  => {

    const isPerson = faker.random.boolean();
    return {
      name: faker.name.firstName(),
      first_name: isPerson ? faker.name.firstName() : undefined,
      last_name: isPerson ? faker.name.lastName() : undefined,
      isPerson: isPerson,
      active: true,
      appealValue: faker.random.number({min: 0, max: 1, precision: 0.01}),
      sport: async (faker) => {
        return (await factory(Sport).create())._id
      },

      // user: (faker) => {
      //   factory(User).create()._id,
      // }
    }

  });
}
module.exports = load;