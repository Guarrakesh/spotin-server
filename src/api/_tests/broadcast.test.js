/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const { some, omit, isNil } = require('lodash');
const app = require('../../index');

const { Business } = require('../models/business.model.js');
const { Broadcast } = require('../models/broadcast.model.js');
const { SportEvent } = require('../models/sportevent.model.js');
const { insertAdmin, insertUser, insertBroadcasts,
insertCompetitors, insertCompetitions, insertSportEvents } = require('./../tests/v1/integration/helpers');


let {dbCompetitors, dbCompetitions, dbSports} = require('./../tests/v1/integration/fixtures');


describe('Broadcasts API', () => {
  let broadcast;
  let admin;


  let businessUser;
  let adminAccessToken;
  let dbEvents;
  let dbBroadcasts;
  let dbBusiness;




  beforeEach(async () => {
    try {
      const password = '123456';
      const passwordHashed = await bcrypt.hash(password, 1);
      admin = {
        email: 'branstark@gmail.com',
        password: passwordHashed,
        name: 'Bran Stark',
        role: 'admin',
        username: "branstark"
      };
      businessUser = {
        email: "rudizerby@gmail.com",
        name: "Rudy",
        password: passwordHashed,
        role: 'business',
        username: 'rudyzerbi'
      };
      await User.remove({});
      await User.insertMany([admin, businessUser], (err, docs) => {
        businessUser._id = docs[1]._id;
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
      ];
      await SportEvent.remove({});
      await SportEvent.insertMany(dbEvents, (err, docs) => {
        if (err)
          throw Error(err)
        dbEvents[0]._id = docs[0]._id;
      });

      dbBusiness = {
        name: "Business test",
        address: {
          location: {
            type: 'Point',
            coordinates: [40.8627346, 14.0823297]
          },

          number: 5,
          city: "Pozzuoli",
          province: "NA",
          country: "Italia",
          zip: 80078,
          street: "Arturo martini",
        },
        providers: ['Sky', 'DAZN'],
        type: 'Pub',
        phone: '345353234',
        vat: '123521',
        user: businessUser._id
      };
      await Business.remove({});
      await Business.insertMany([dbBusiness], (err, docs) => {
        console.log(err);
        dbBusiness._id = docs[0]._id;
      });


      dbBroadcasts = [
        {
          business: dbBusiness._id,
          event: dbEvents[0]._id,
          offer: {
            title: "Pizza e bibita",
            type: 0,
            value: 10
          },
          start_at: new Date(),
          end_at: new Date(),
        },
        {
          business: dbBusiness._id,
          event: dbEvents[0]._id,
          offer: {
            title: "Sconto del 10%",
            type: 1,
            value: 10
          },
          start_at: new Date(),
          end_at: new Date(),
        }
      ];
      await Broadcast.remove({});
      await Broadcast.insertMany(dbBroadcasts);

      admin.password = password;
      adminAccessToken = (await User.findAndGenerateToken(admin)).accessToken;

    } catch (e) { console.log(e)}

  });

  describe('GET /v1/broadcasts', () => {
    it('Should return broadcasts near current location', async () => {
      return request(app)
        .get(`/v1/broadcasts?latitude=14.0823297&longitude=40.8551719&radius=50`)


        .then(res => {

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].business).to.be.an('object');
          expect(res.body[0].business.name).to.be.equal(dbBusiness.name);
        });
    })
  })



});
