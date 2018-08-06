/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs')
const { some, omit, isNil } = require('lodash');
const app = require('../../../index');

const { Competitor } = require('../../models/competitor.model');
const { Competition } = require('../../models/competition.model');
const SportEvent = require('../../models/sportevent.model');
const { Sport } = require('../../models/sport.model');
const User = require('../../models/user.model');



describe('SportEvent API', () => {

  let dbCompetitions;
  let dbCompetitors;
  let dbUsers;
  let dbSports;
  let dbEvents;
  let admin;
  let event;
  let adminAccessToken;
  let currentDate;


  beforeEach(async () => {


    await User.remove({});
    await Competition.remove({});
    await Sport.remove({});
    await SportEvent.remove({});
    await Competitor.remove({});
    const password = '123456';
    currentDate = new Date();
    const passwordHashed = await bcrypt.hash(password,1);
    dbSports = {
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
    dbUsers = {
      branStark: {
        email: 'branstark@gmail.com',
        password: passwordHashed,
        name: 'Bran Stark',
        role: 'admin',
        username: "branstark"
      },
      jonSnow: {
        email: 'jonsnow@gmail.com',
        password: passwordHashed,
        name: 'Jon Snow',
        username: "__jonsnow"
      },
    };
    admin = dbUsers.branStark;
    await User.insertMany([admin]);
    admin.password = password;
    adminAccessToken = (await User.findAndGenerateToken(admin)).accessToken;

    await Sport.insertMany([dbSports.calcio, dbSports.tennis], (err, docs) => {
      dbSports.calcio._id = docs[0]._id;
      dbSports.tennis._id = docs[1]._id;
    });
    dbCompetitors = {
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

    await Competitor.insertMany([dbCompetitors.napoli, dbCompetitors.juventus,
      dbCompetitors.federer, dbCompetitors.nadal], (err, docs) => {
      if (err) {
        console.log(err); return;
      }
      dbCompetitors.napoli._id = docs[0]._id;
      dbCompetitors.juventus._id = docs[1]._id;
      dbCompetitors.federer._id = docs[2]._id;
      dbCompetitors.nadal._id = docs[3]._id;
    });
    dbCompetitions = {
      serieA: {
        name: "Serie A",
        sport_id:  mongoose.Types.ObjectId(dbSports.calcio._id),
        country: "Italia",
        competitorsHaveLogo: true,
      },

      wimbledon: {
        name: "Wimbledon",
        sport_id: mongoose.Types.ObjectId(dbSports.tennis._id),
        competitorsHaveLogo: false,
      }
    };
    await Competition.insertMany([dbCompetitions.serieA, dbCompetitions.wimbledon], (err, docs) => {
      dbCompetitions.serieA._id = docs[0]._id;
      dbCompetitions.wimbledon._id = docs[1]._id;
    });
    dbEvents = [
      {
        name: "Juventus Napoli",
        description: "Prova",
        competitors: [dbCompetitors.juventus, dbCompetitors.napoli],
        sport_id: dbSports.calcio._id,
        start_at: (currentDate.toISOString()),
        competition: dbCompetitions.serieA,

      },
      {
        name: "Wimbledon - Finale",
        description: "La finale più attesa di sempre",
        competitors: [dbCompetitors.federer, dbCompetitors.nadal],
        competition: dbCompetitions.wimbledon,
        start_at: (currentDate.toISOString()),
        sport_id: dbSports.tennis._id
      }
    ];

    await SportEvent.insertMany(dbEvents, (err, docs) => {
      dbEvents[0]._id = docs[0]._id;
      dbEvents[1]._id = docs[1]._id;
    });

    event = {
      name: "Napoli Juventus",
      description: "Gara di ritorno",
      competitors: [dbCompetitors.napoli, dbCompetitors.juventus],
      sport_id: dbSports.calcio._id,
      start_at:(currentDate).toISOString(),
      competition: dbCompetitions.serieA
    };


  });
  describe('GET /v1/competitions/:id/events', () => {
    it('Should return events of a single competitions', async () => {
      return request(app)
        .get(`/v1/competitions/${dbCompetitions.serieA._id}/events`)
        .expect(httpStatus.OK)
        .then(res => {
          console.log(res.body);

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].name).to.be.equal(dbEvents[0].name);
        });
    })
  })


  describe('POST /v1/events/', () => {
    it('Should create new event if request is ok', async () => {
      return request(app)
        .post(`/v1/events`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(event)
      expect(httpStatus.CREATED)
        .then((res) => {

          expect(res.body.name).to.be.equal(event.name);
          expect(res.body.competition).to.be.an('object');
          expect(res.body.competitors).to.be.an('array');
        })
    });
    it('Should return validation error when no sport is given', async () => {
      delete event.sport_id;
      return request(app)
        .post(`/v1/events`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors[0].field).to.be.equal('sport_id')
        });
    });
    it('Should return validation error when competition has no id', async () => {
      delete event.competition._id;
      return request(app)
        .post(`/v1/events`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors[0].field).to.be.equal('competition._id')
        });
    });
    it('Should return validation error when competitors have no id', async () => {
      delete event.competitors[0]._id;
      delete event.competitors[1]._id;
      return request(app)
        .post(`/v1/events`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors[0].field).to.be.equal('competitors.0._id');
          expect(res.body.errors[1].field).to.be.equal('competitors.1._id');
        })
    });
    it('Should return return error if wrong sport ObjectId is given', async () => {
      event.sport_id = "aaaa0000";
      return request(app)
        .post(`/v1/events`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(event)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.have.string('sport_id: Cast to ObjectID failed');

        });
    });
    it('Should return return error if sport does not exist', async () => {
      event.sport_id = mongoose.Types.ObjectId();
      return request(app)
        .post(`/v1/events`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {

          expect(res.body.message).to.be.equal('Lo sport specificato non esiste.');

        });
    });
    it('Should return return error if competition does not exist', async () => {
      event.competition._id = mongoose.Types.ObjectId();
      return request(app)
        .post(`/v1/events`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {

          expect(res.body.message).to.be.equal('La competizione specificata non esiste.');

        });
    });
    it('Should return return error if one or more competitors do not exist', async () => {
      event.competitors[0]._id = mongoose.Types.ObjectId();
      return request(app)
        .post(`/v1/events`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {

          expect(res.body.message).to.be.equal('Uno o più sfidanti specificati non esistono.');

        });
    });
  })
})
