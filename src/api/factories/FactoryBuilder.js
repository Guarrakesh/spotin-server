const mongoose = require('mongoose');

class FactoryBuilder {

  constructor(className, name, objects = {}, definitions = {}, states = {}, afterMaking = [], afterCreating = [], faker) {
    this._name = name;
    this._class = className;
    this._objects = objects;
    this._faker = faker;
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
    const results = this.make(attributes);
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
  async store(results) {

      for (let i in results) {
        await results[i].save();
      }

  }

  /**
   * Create a collection of models.
   * @param attributes
   * @returns {*}
   */
  make(attributes) {
    if (this._amount === null) {
      const instance = new (this._objects[this._class])(this.getRawAttributes(attributes));
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
      instances.push(new (this._objects[this._class])(this.getRawAttributes(attributes)))
    }
    this.callAfterMaking(instances);

    return instances;
  }
  getRawAttributes(attributes) {
    if (this._definitions[this._class] && this._definitions[this._class][this._name]) {
      let fakedAttributes = this._definitions[this._class][this._name](this._faker);
      fakedAttributes = { ...fakedAttributes, ...attributes };

      return fakedAttributes
    }
    return this.expandAttributes(attributes);
  }

  /**
   * Espande tutti gli attributi
   * @param attributes
   */
  expandAttributes(attributes = []) {
    const newAttributes = attributes.map(attribute => {
      if (typeof attribute === "function") {
        attribute = attribute(attributes); // Se l'attributo è una funzione (es, nelle chiavi esterne) allora chiama la funzione
        // e gli passa, se gli serve, tutti gli attributi del model
      }

    });

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