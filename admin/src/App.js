import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Admin, Resource } from 'react-admin';

import dataProvider from './providers/dataProvider';
import authProvider from './providers/authProvider';


import AdminRoutes from './containers/admin';
import BusinessRoutes from './containers/business';


import history from './history';
import theme from './theme';

const App = () => (

  <Admin
    title="SpotIn - Dashboard"
    theme={theme}
    history={history}
    dataProvider={dataProvider} authProvider={authProvider} >

    {permissions =>
      permissions === "admin" ? AdminRoutes : BusinessRoutes
    }



  </Admin>


);
export default App;
