const mongoose = require('mongoose');
const async = require('async');
class FactoryBuilder {

  constructor(className, name, objects = {}, definitions = {}, states = {}, afterMaking = [], afterCreating = []) {
    this._name = name;
    this._class = className;
    this._objects = objects;
    this._states = states;
    this._definitions = definitions;
    this._afterCreating = afterCreating;
    this._afterMaking = afterMaking;
    this._amount = null;
    this._activeStates = [];
  }

  /**
   *  * Set the amount of models you wish to create / make.
   * @param amount
   * @returns {FactoryBuilder}
   */
  times(amount) {
    this._amount = amount;
    return this;
  }

  /**
   * Set the state to be applied to the model.
   *
   * @param state|String
   * @return $this
   */
  state(state) {
    return this.states([state]);
  }

  /**
   * Set the states to be applied to the model.
   * @param states|String
   */
  states(states) {
    this._activeStates = states.constructor === Array ? states : arguments;
  }

  /**
   * Create a collection of models and persist them to the database.
   * @param attributes
   */
  async create(attributes = []) {

    const results = await this.make(attributes);
    if (results.constructor.name === "model") {
      this.callAfterCreating([results]);
      await this.store([results]);
    } else if (results.constructor === Array) {
      this.callAfterCreating(results);
      await this.store(results);
    }
    return results;
  }

  /**
   * Set the connection name on the results and store them.
   * @param results
   */
  async store(models) {
    try {
      const results = []
      for (const model of models) {
        let aa = await model.save();
        results.push(results);
      }
      return results;
    } catch (e) {
      console.log(e);
      throw Error(e);
    }

  }

  /**
   * Create a collection of models.
   * @param attributes
   * @returns {*}
   */
  async make(attributes) {
    if (this._amount === null) {
      const instance = new (this._objects[this._class])(await this.getRawAttributes(attributes));
      this.callAfterMaking([this._class]);
      return instance;
    }
    /*if ($this->amount < 1) {
      return (new $this->class)->newCollection();
    }

    const instances = (new $this->class)->newCollection(array_map(function () use ($attributes) {
      return $this->makeInstance($attributes);
    }, range(1, $this->amount)));
    */
    let instances = [];
    for (let i=0; i < this._amount; i++) {
      instances.push(new (this._objects[this._class])(await this.getRawAttributes(attributes)))
    }
    this.callAfterMaking(instances);

    return instances;
  }
  async getRawAttributes(attributes) {
    let fakedAttributes = attributes;
    if (this._definitions[this._class] && this._definitions[this._class][this._name]) {
      fakedAttributes = await this._definitions[this._class][this._name](this._faker);
      fakedAttributes = { ...fakedAttributes, ...attributes };

    }
    const expanded = this.expandAttributes(fakedAttributes);
    return expanded;
  }

  /**
   * Espande tutti gli attributi
   * @param attributes
   */
  expandAttributes(attributes = []) {
    const newAttributes = Object.keys(attributes).reduce(
        (acc,attribute) => ({
          ...acc,
          [attribute]: typeof attributes[attribute] === "function"
                      ? attributes[attribute](attributes)
                      : attributes[attribute],
        }), {})

    return newAttributes;
  }

  callAfterMaking(models) {
    this.callAfter(this._afterMaking, models);
  }

  callAfterCreating(models) {
    this.callAfter(this._afterCreating, models);
  }
  callAfter(afterCallbacks, models) {
    const states = [[this._name], ...this._activeStates];
    models.forEach(model => {
      states.forEach(state => this.callAfterCallbacks(afterCallbacks, model, state));
    });
  }

  callAfterCallbacks(afterCallbacks, model, state) {
    if (!(afterCallbacks[this._class]) || !afterCallbacks[this._class][state]) return;

    afterCallbacks[this._class][state].forEach(callback => {
      callback(model, this._faker);
    })

  }
}

module.exports = FactoryBuilder;