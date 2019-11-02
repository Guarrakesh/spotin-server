const Injector = require('../../../../di/Injector');
const {expect} = require('chai');

const Logger = {
  log: function(log) {}
};

const SimpleLogger = function() {};
SimpleLogger.prototype = Object.create(Logger);
SimpleLogger.prototype.log = function(log) {
  console.log(log);
};

const RandomService  = function(logger) {
  this.logger = logger;
};
RandomService.prototype.returnLogger = function() {
  return this.logger;
};

describe('Injector', () => {

  afterEach(() => {
    Injector._instance = null;
  });
  it('Should inject a logger into a service', () => {
    Injector.getInstance().register('logger', SimpleLogger);
    const randomService = Injector.getInstance().get(RandomService);
    expect(randomService.returnLogger().log).to.exist;
  });

  it('Should return undefined if logger is not injected', () => {
    expect(() => Injector.getInstance().get(RandomService)).to.throw('Cannot resolve logger');
  })
});
