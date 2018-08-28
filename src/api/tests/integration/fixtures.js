const mongoose = require('mongoose');
const password = '123456';
const bcrypt = require('bcryptjs')
currentDate = new Date();
exports.dbSports = {
  calcio: {
    name: "Calcio",
    slug: "football",
    active: true
  },
  tennis: {
    name: "Tennis",
    slug: "football",
    active: true
  }
};

exports.dbUsers = {
  branStark: {
    email: 'branstark@gmail.com',
    password: undefined,
    name: 'Bran Stark',
    role: 'admin',
    username: "branstark"
  },
  jonSnow: {
    email: 'jonsnow@gmail.com',
    password: undefined,
    name: 'Jon Snow',
    username: "__jonsnow"
  },
};


let dbCompetitors = {
  napoli: {
    name: "Napoli",
    slug: "napoli",
    image_versions: [{url: "http://test.com", width: 10, height: 10}]
  },
  juventus: {
    name: "Juventus",
    slug: "juventus",
    image_versions: [{url: "http://test2.com", width: 10, height: 10}],
  },
  federer: {
    first_name: "Roger",
    last_name: "Federer",
    full_name: "Roger Federer",
    slug: "roger-federer",
    isPerson: true,
  },
  nadal: {
    first_name: "Rafael",
    last_name: "Nadal",
    full_name: "Rafael Nadal",
    slug: "rafael-nadal",
    isPerson: true,
  }
};


let dbCompetitions = {
  serieA: {
    name: "Serie A",
    sport_id: undefined,
    country: "Italia",
    competitorsHaveLogo: true,
  },

  wimbledon: {
    name: "Wimbledon",
    sport_id: undefined,
    competitorsHaveLogo: false,
  }
};


exports.dbEvents = [
  {
    name: "Juventus Napoli",
    description: "Prova",
    competitors: [dbCompetitors.juventus, dbCompetitors.napoli],
    sport_id: undefined,
    start_at: (currentDate.toISOString()),
    competition: dbCompetitions.serieA,

  },
  {
    name: "Wimbledon - Finale",
    description: "La finale più attesa di sempre",
    competitors: [dbCompetitors.federer, dbCompetitors.nadal],
    competition: dbCompetitions.wimbledon,
    start_at: (currentDate.toISOString()),
    sport_id: undefined,
  }
];


exports.dbCompetitors = dbCompetitors;
exports.dbCompetitions = dbCompetitions;
