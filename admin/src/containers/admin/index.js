import React from 'react';

import { Resource } from 'react-admin';
import { PostList, PostEdit, PostCreate } from './resources/posts';
import { UserList, UserEdit, UserCreate } from './resources/users';
import { SportList, SportEdit, SportCreate } from './resources/sports';
import { CompetitionList, CompetitionEdit, CompetitionCreate } from './resources/competitions';
import { BusinessList, BusinessEdit, BusinessCreate } from './resources/businesses';
import { EventList, EventEdit, EventCreate } from './resources/events';
import { CompetitorList, CompetitorEdit, CompetitorCreate } from './resources/competitors';
import { BroadcastList, BroadcastCreate } from './resources/broadcasts';

import {Admin as AdminBase} from 'react-admin';


import dataProvider from '../../providers/dataProvider';
import authProvider from '../../providers/authProvider';
import history from '../../history';
import theme from './theme';

const AdminRoutes = [
    <Resource name="sports" list={SportList} edit={SportEdit} create={SportCreate} />,
    <Resource name="competitions" list={CompetitionList} edit={CompetitionEdit} create={CompetitionCreate}/>,
    <Resource name="competitors" list={CompetitorList} edit={CompetitorEdit} create={CompetitorCreate}/>,
    <Resource name="businesses" list={BusinessList} options={{label: "Locali"}} create={BusinessCreate} edit={BusinessEdit}/>,
    <Resource name="events" list={EventList} edit={EventEdit} create={EventCreate}/>,

    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />,
    <Resource name="broadcasts" list={BroadcastList} create={BroadcastCreate} />
];

const Admin = () => (
  <AdminBase dataProvider={dataProvider}
     authProvider={authProvider}
     theme={theme}
     history={history}
     >
    {AdminRoutes}
  </AdminBase>
)
export default Admin;
