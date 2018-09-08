import React from 'react';

import { Admin as AdminBase, Resource } from 'react-admin';
import "business/assets/scss/material-dashboard-pro-react.css";

import "./assets/css/material-dashboard-react.css"; /* eslint-disable-line import/no-extraneous-dependencies */




import dataProvider from '../../providers/dataProvider';
import authProvider from '../../providers/authProvider';
import history from '../../history';
import theme from './theme';
import Layout from './layout';


import EventList from './resources/events/EventList';
import Dashboard from './views/Dashboard';
import customSaga from './sagas';


import businessReducer from './reducers/business';


/* eslint-disable*/
const BusinessRoutes = [
  <Resource key="events" name="events" list={EventList} options={{label:"Eventi in programma"}}/>,


];

class Business extends React.Component {

  render() {
    return (
      <AdminBase theme={theme}
                 customSagas={[customSaga(authProvider, dataProvider)]}
                 customReducers={{ business: businessReducer}}
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

/* eslint-enable */
