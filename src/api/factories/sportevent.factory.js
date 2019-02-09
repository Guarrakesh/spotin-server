const { SportEvent } = require("../models/sportevent.model");
const { Sport } = require('../models/sport.model');
const { Competition } = require('../models/competition.model');
const { Competitor } = require('../models/competitor.model');
const { factory } = require('./Factory');

const faker = require('faker');
faker.locale = "it"

async function load(Factory) {

  const sport = await factory(Sport).create();
  const competition = await factory(Competition).create({ sport: sport._id});
 const competitors = await factory(Competitor, undefined, 3).create({ sport: sport._id});

  Factory.define(SportEvent, async => ({
        sport: sport._id,
        competition: competition._id,
        competitors: competitors.map(competitor => ({
          _id: competitor._id,
          name: competitor.name,
          competitor: competitor
        })),
        name: competitors[0].name + " - " + competitors[1].name,
        start_at: faker.date.future(0),
        providers: faker.random.arrayElement(['Sky', "DAZN", 'Digitale Terrestre']),

      })
  );



}



module.exports = load;