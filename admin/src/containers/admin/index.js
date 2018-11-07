import React from 'react';
import {Admin as AdminBase, Resource} from 'react-admin';

import { UserList, UserEdit, UserCreate } from './resources/users';
import { SportList, SportEdit, SportCreate } from './resources/sports';
import { CompetitionList, CompetitionEdit, CompetitionCreate } from './resources/competitions';
import { BusinessList, BusinessEdit, BusinessCreate } from './resources/businesses';
import { EventList, EventEdit, EventCreate } from './resources/events';
import { CompetitorList, CompetitorEdit, CompetitorCreate } from './resources/competitors';
import { BroadcastList, BroadcastCreate, BroadcastEdit } from './resources/broadcasts/broadcasts';
import { ReservationList } from './resources/reservations';
import { BroadcastRequestList, BroadcastRequestShow } from './resources/broadcastRequests';

import dataProvider from '../../providers/dataProvider';
import authProvider from '../../providers/authProvider';
import history from '../../history';
import theme from './theme';
/* eslint-disable */
const AdminRoutes = [
  <Resource name="sports" list={SportList} edit={SportEdit} create={SportCreate} />,
  <Resource name="competitions" list={CompetitionList} edit={CompetitionEdit} create={CompetitionCreate}/>,
  <Resource name="competitors" list={CompetitorList} edit={CompetitorEdit} create={CompetitorCreate}/>,
  <Resource name="businesses" list={BusinessList} options={{label: "Businesses"}} create={BusinessCreate} edit={BusinessEdit}/>,
  <Resource name="events" list={EventList} edit={EventEdit} create={EventCreate}/>,

  <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />,
  <Resource name="broadcasts" list={BroadcastList} create={BroadcastCreate} edit={BroadcastEdit} />,
  <Resource name="reservations"
            options={{label: "Reservations"}}
            list={ReservationList}/>,
  <Resource name="requests" list={BroadcastRequestList}
            options={{label: "Broadcast Requests"}}
            show={BroadcastRequestShow}/>
];
/* eslint-enable */
const Admin = () => (

    <AdminBase dataProvider={dataProvider}
               authProvider={authProvider}
               theme={theme}
               history={history}
    >
      {AdminRoutes}
    </AdminBase>

);
export default Admin;
