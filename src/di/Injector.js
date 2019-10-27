class Injector {

  constructor() {
    if (!Injector._instance) {
      Injector._instance = this;
      this._dependencies = {};
      this._instances = {};
    }
    return Injector._instance;
  }
  static getInstance() {
    if (!Injector._instance) {
      return new Injector();
    }
    return Injector._instance;
  }

  register(key, value) {
    this._dependencies[key] = value;
  }

  get(func) {
    const obj = new func;
    const dependencies = this.resolveDependencies(func);
    func.apply(obj, dependencies);
    return obj;
  }
  resolveDependencies(func) {
    const args = this.getArguments(func);
    // Analizzo tutte le dipendenze della funzione (costruttore)
    if (args.length === 1 && args[0] === "") return undefined;
    const deps = [];
    for (let i=0; i < args.length; ++i) {
      let dependency = this._dependencies[args[i]];
      if (!dependency) {
        throw new Error('Cannot resolve ' + dependency);
      }
      if (!this._instances[args[i]]) {
        this._instances[args[i]] = this.get(dependency);
      }
      deps.push(this._instances[args[i]])
    }
    return deps;
  }
  getArguments(func) {
    //This regex is from require.js
    const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    const args = func.toString().match(FN_ARGS)[1].split(',');
    return args;
  }

}

module.exports = Injector;
