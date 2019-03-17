const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../index');
const { expect } = require('chai');
const { factory } = require('../../../factories/Factory');
const User = require("../../../models/user.model");
const { BroadcastReviewQuestion } = require('../../../models/review-question.model');
let admin, questions;


describe('BroadcastReviewQuestion API', async () => {
  beforeEach(async () => {
    admin = await factory(User, 'admin').create({ password: '123456'});
    admin.password = '123456';
    adminAccessToken = (await User.findAndGenerateToken(admin)).accessToken;

    BroadcastReviewQuestion.deleteMany({});
    questions = await factory(BroadcastReviewQuestion, null, 4).create();
  });
  afterEach(async () => {
    await BroadcastReviewQuestion.deleteMany({});
  });
  describe('GET /v1/broadcastreview_questions', () => {
    it('Should return broadcast review question', () => {
      return request(app)
          .get('/admin/broadcastreview_questions')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(4);
          })
    });
  });


  describe('POST /v1/broadcastreview_questions', () => {
    it('Should create a broadcast review question', async () => {
      const newQuestion = await factory(BroadcastReviewQuestion).make();
      return request(app)
          .post('/admin/broadcastreview_questions')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newQuestion)
          .expect(httpStatus.CREATED)
          .then(res => {
            expect(res.body.text).to.be.equal(newQuestion.text);
            expect(res.body.value).to.be.equal(newQuestion.value);
          })
    })
  })

  describe('GET /v1/broadcastsreview_questions/:id', () => {
    it('Should get a broadcast review question', async () => {
      return request(app)
          .get(`/admin/broadcastreview_questions/${questions[0]._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body._id).to.equal(questions[0].id)
          })

    })
  })



});
