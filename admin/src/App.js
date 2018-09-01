import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Resource, AUTH_GET_PERMISSIONS } from 'react-admin';
import Admin from './containers/admin';
import Business from './containers/business';

import authProvider from './providers/authProvider';


class App extends React.Component {
  constructor() {
    super();
    this.state = {rootComponent: null};
  }
  componentWillMount(props) {
    this.init();
  }
  init = async props => {
    return authProvider(AUTH_GET_PERMISSIONS).then((role) => {
      if (role === "admin")
        this.setState({rootComponent: <Admin/>});
      else if (role === "business")
        this.setState({rootComponent: <Business/>});
    });
  }
  render() {
    return this.state.rootComponent;
  }


}
export default App;
