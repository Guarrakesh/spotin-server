const faker = require('faker');
faker.locale = "it";
const { Sport } = require('../models/sport.model');


function load(Factory, factory) {


  Factory.define(Sport, async => {


    const sportName = faker.random.arrayElement(['Calcio', 'Basket', 'Tennis', 'Pallavolo', 'American Football', 'Motori', 'Rugby']);
    return {
      name: sportName,
      active: true,
      duration: faker.random.number({min: 30, max: 300}),
      appealValue: faker.random.number({min: 0, max: 1, precision: 0.01})

      // user: (faker) => {
      //   factory(User).create()._id,
      // }
    }

  });
}
module.exports = load;