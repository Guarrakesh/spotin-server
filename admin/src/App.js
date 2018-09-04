import React from 'react';
import { AUTH_GET_PERMISSIONS } from 'react-admin';
import './App.css';


import Admin from './containers/admin';
import Business from './containers/business';

import authProvider from './providers/authProvider';


class App extends React.Component {
  constructor() {
    super();
    this.state = {rootComponent: null};
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    return authProvider(AUTH_GET_PERMISSIONS).then((role) => {
      if (role === "admin")
        this.setState({rootComponent: <Admin/>});
      else if (role === "business")
        this.setState({rootComponent: <Business/>});
    }).catch( () => {
        this.setState({rootComponent: <Admin/>}); //Di default, reindirizzo a Business
    });

  }
  render() {
    return this.state.rootComponent;
  }


}
export default App;
