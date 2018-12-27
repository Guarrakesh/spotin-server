const faker = require('faker');
const fs = require("fs");
const FactoryBuilder = require('./FactoryBuilder');

faker.locale = "it";
class Factory {


  static getInstance(faker,  pathToFactories = "./src/api/factories") {
    if (Factory.instance) return Factory.instance;

    Factory.instance = new Factory(faker);
    Factory.instance.load(pathToFactories);
    Factory.instance.faker = faker;

    return Factory.instance;
  }
  // Singleton
  constructor() {
    this._objects = {};
    this._definitions = {};
    this._states = {};
    this._afterCreating = {};
    this._afterMaking = {};
  }
  load(path) {
    const resolve = require("path").resolve;
    const absPath = resolve(path);
    const files = fs.readdirSync(absPath).filter(fn => fn.endsWith(".factory.js"));
    files.forEach(file => {
      console.log(absPath + "/" + file);
      const load = require(absPath + "/" + file);
      load(Factory.instance);
    });


  }
  define(object, attributes, name = "default") {

    const className = object.modelName;
    this._objects[className] = object;
    this._definitions[className] =
      this._definitions[className] ? ({...this._definitions[className], [name]: attributes }) : { [name]: attributes };

    return this;
  }

  defineAs(object, name, attributes) {
    return this.define(object, attributes, name);
  }

  state(object, state, attributes) {
    const className = object.modelName;

    this._objects[className] = object;
    this._states[className] = this._states[className]
      ? ({ ...this._states[className], [state]: attributes}) : { [state]: attributes };

    return this;
  }

  create(object, attributes = []) {
    const className = object.modelName;
    return this.of(className).create(attributes);
  }
  createAs(object, name, attributes = []) {
    const className = object.modelName;
    return this.of(className, name).create(attributes);
  }
  /**
   * Create an instance of the given model.
   */
  make(object, attributes = []) {
    const className = object.modelName;
    return this.of(className).make(attributes);
  }

  /**
   * Create an instance of the given model and type.
   * @param object
   * @param name
   * @param attributes
   */
  makeAs(object, name, attributes = []) {
    const className = object.modelName;
    return this.of(className, name).make(attributes);
  }


  /**
   * Create a builder for the given model.
   * @param className
   * @param name
   */
  of(className, name = "default") {
    return new FactoryBuilder(className, name, this._objects, this._definitions, this._states,
      this._afterMaking, this._afterCreating, this.faker)
  }


  /**
   * Define a callback to run after creating a model.
   *
   * @param   object
   * @param   callback
   * @param   name
   * @return  Factory
   */
  afterCreating(object, callback, name = "default") {
    const className = object.modelName;
    this._afterCreating[className] = this._afterCreating[className]
      ? { ...this._afterCreating[className], [name]: callback } : { [name]: callback };
  }

  /**
   * Define a callback to run after making a model.
   *
   * @param   object
   * @param   callback
   * @param   name
   * @return Factory
   */
  afterMaking(object, callback, name = "default") {
    const className = object.modelName;
    this._afterMaking[className] = this._afterMaking[className]
        ? { ...this._afterMaking[className], [name]: callback } : { [name]: callback };
  }

}

const index = process.argv.indexOf("--pathToFactories");
let pathToFactories = undefined;
if (index > 0) {
  pathToFactories = process.argv[index+1];
}
function factory(object, name = null,  times = null) {
  const className = object.modelName;
  const _factory = Factory.getInstance(faker, pathToFactories);
  if (object && name) {
    return _factory.of(className, name).times(times || null);
  } else if (times) {
    return _factory.of(className).times(times);
  } else {
    return _factory.of(className);
  }
}
exports.factory = factory; // Per USARE i factory nei test
exports.Factory = Factory.getInstance(faker, pathToFactories); //Usato per definire i factory nei *.factory.js
