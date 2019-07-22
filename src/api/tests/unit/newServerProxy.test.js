const {NewServerProxy, TokenModel} = require('../../utils/newServerProxy');
const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;

const vars = require('../../../config/vars');

describe('New Server Proxy', () => {
  before(function() {
    mongoose.Promise = Promise;
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
      process.exit(-1);
    });
    console.log(process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI, { keepAlive: true });
  });
  after(async function() {
     await TokenModel.remove({});
  });
  it('should get singleton instance', () => {
    const newServerProxy = new NewServerProxy();
    expect(NewServerProxy.getInstance() === newServerProxy).to.be.true;

  });

  it('should get and store the token', async() => {
    const newServerProxy = NewServerProxy.getInstance();
    const token = await newServerProxy.getToken();
    expect(token).to.be.an('object');
    expect(token).to.have.property('accessToken');
    const stored = await TokenModel.findOne().lean();
    expect(token.accessToken === stored.accessToken).to.be.true;
  });
  it('should refresh the token', async() => {
    try {
      const newServerProxy = NewServerProxy.getInstance();
      const token = {...(await newServerProxy.getToken())};
      const newToken = await newServerProxy.refreshToken(token);
      expect(newToken.refreshToken).to.not.equal(token.refreshToken);
    } catch (e) {
      console.log(e);
    }
  });
  it('should post a sport', async() => {
    const newServerProxy = NewServerProxy.getInstance();
    try {
      const response = await newServerProxy.post('sports', {
        name: "Ciaociao",
        duration: 120,

      });
      expect(response).to.be.an('object');
    } catch (e) {
      console.log(e);
    }

  });
});