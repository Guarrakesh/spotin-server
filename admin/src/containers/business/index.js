import React from 'react';
import { Admin as AdminBase, Resource } from 'react-admin';
import dataProvider from '../../providers/dataProvider';
import authProvider from '../../providers/authProvider';
import history from '../../history';
import theme from './theme';
import Layout from './layout';
import "./assets/css/material-dashboard-react.css?v=1.4.1";

import EventList from './resources/events/EventList';
import Dashboard from './views/Dashboard';

const BusinessRoutes = [
  <Resource name="events" list={EventList}/>
];
const Business = () => (
  <AdminBase theme={theme}
    dataProvider={dataProvider}
    authProvider={authProvider}
    history={history}
    dashboard={Dashboard}
    appLayout={Layout}
    >
    {BusinessRoutes}
  </AdminBase>
)

export default Business;
