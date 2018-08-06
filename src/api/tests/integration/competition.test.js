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

const { Competition } = require('../../models/competition.model');
const { Sport } = require('../../models/sport.model');
const User = require('../../models/user.model');




describe('Competitions API', () => {
  let sport;
  let admin;
  let dbComps;
  let sportId;
  let comp;
  let adminAccessToken;





  beforeEach(async () => {
    const password = '123456';
    const passwordHashed = await bcrypt.hash(password,1);
    admin = {
      email: 'branstark@gmail.com',
      password: passwordHashed,
      name: 'Bran Stark',
      role: 'admin',
      username: "branstark"
    };

    sport = {
      name: "Calcio"
    };

    await User.remove({});
    await User.insertMany([admin]);

    await Sport.remove({});
    let dbSport = new Sport(sport);
    sport = await dbSport.save();
    sportId = sport._id;

    admin.password = password;
    adminAccessToken = (await User.findAndGenerateToken(admin)).accessToken;

    await Competition.remove({});
    dbComps = {
      serieA: {
        name: "Serie A",
        sport_id:  mongoose.Types.ObjectId(sportId),
        country: "Italia"
      },
      champions: {
        sport_id: mongoose.Types.ObjectId(sportId),
        name: "Champions League",
        country: "Europa"
      }

    };
    comp = {
      name: "Premier League",
      sport_id: sportId
    };

    await Competition.insertMany([dbComps.serieA, dbComps.champions]);

  });


  describe('GET /v1/sports/:id/competitions', () => {
    it('Should return competitions of a given sport', async () => {
      return request(app)
        .get(`/v1/sports/${sportId}/competitions`)
        .expect(httpStatus.OK)
        .then((res) => {
          const includesSerieA = some(res.body, dbComps.serieA);
          const includesChamp = some(res.body, dbComps.champions);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);


        })
    })
  });

  describe('POST /v1/sports/:id/competitions', () => {
    it('Should create a new competition if request is ok', async() => {
      return request(app)
        .post(`/v1/sports/${sportId}/competitions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(comp)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.competitorsHaveLogo).to.be.true;
        });
    });
    it('Should report an error if sport does not exists', async () => {
      return request(app)
        .post(`/v1/sports/111/competitions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(comp)
        .expect(httpStatus.NOT_FOUND)

    });

    it('Should return Unauthorized if access token is not provided', async () => {
      return request(app)
        .post(`/v1/sports/${sportId}/competitions`)
        .send(comp)
        .expect(httpStatus.UNAUTHORIZED)

    });
  });
  describe('PATCH v1/competitions/:id', () => {
    it('Should update an existing competitions', async () => {
      const comp = (await Competition.findOne({name: dbComps.serieA.name}).lean().exec())
      const id = comp._id;
      return request(app)
        .patch(`/v1/competitions/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({"name": "Bundesliga"})
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.be.equal('Bundesliga');
        })
    });
  })
  describe('DELETE v1/competitions/:id', async () => {
    it('Should delete competition', async  () => {
      const comp = (await Competition.findOne({name: dbComps.serieA.name}).lean().exec());
      const id = comp._id;
      return request(app)
        .delete(`/v1/competitions/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NO_CONTENT)
        .then(async () => {
          const comps = await Competition.find({});
          //Eliminando il calcio, resta solo il tennis nel db
          expect(comps).to.have.lengthOf(1);
        })

    })
  })

});
