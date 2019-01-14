const { SportEvent } = require("../models/sportevent.model");
const { Sport } = require('../models/sport.model');
const { Competition } = require('../models/competition.model');
const { Competitor } = require('../models/competitor.model');
const async = require('async');
const { factory } = require('./Factory');

const faker = require('faker');
faker.locale = "it"

async function load(Factory) {


  Factory.define(SportEvent, async => ({
        sport: sport._id,
        competition: async () => {
          await factory(Competition).create({ sport: sport._id });
        },
        competitors: competitors,

        name: competitors[0].name + " - " + competitors[1].name,
        start_at: faker.date.soon(),
        providers: faker.random.arrayElement(['Sky', "DAZN", 'Digitale Terrestre']),

      })
  );



}



module.exports = load;