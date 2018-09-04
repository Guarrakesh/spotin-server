import React from 'react';

import { Admin as AdminBase, Resource } from 'react-admin';


import "./assets/css/material-dashboard-react.css"; /* eslint-disable-line import/no-extraneous-dependencies */


import dataProvider from '../../providers/dataProvider';
import authProvider from '../../providers/authProvider';
import history from '../../history';
import theme from './theme';
import Layout from './layout';


import EventList from './resources/events/EventList';
import Dashboard from './views/Dashboard';

/* eslint-disable*/
const BusinessRoutes = [
  <Resource name="events" list={EventList}/>
];

class Business extends React.Component {

  render() {
    return (
      <AdminBase theme={theme}
                 dataProvider={dataProvider}
                 authProvider={authProvider}
                 history={history}
                 dashboard={Dashboard}
                 appLayout={Layout}>
        {BusinessRoutes}
      </AdminBase>
    )
  }


}
export default Business;
