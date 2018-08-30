import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Admin, Resource } from 'react-admin';

import dataProvider from './providers/dataProvider';
import authProvider from './providers/authProvider';

import { PostList, PostEdit, PostCreate } from './resources/posts';
import { UserList, UserEdit, UserCreate } from './resources/users';
import { SportList, SportEdit, SportCreate } from './resources/sports';
import { CompetitionList, CompetitionEdit, CompetitionCreate } from './resources/competitions';
import { BusinessList, BusinessEdit, BusinessCreate } from './resources/businesses';
import { EventList, EventEdit, EventCreate } from './resources/events';
import { CompetitorList, CompetitorEdit, CompetitorCreate } from './resources/competitors';



import history from './history';
import theme from './theme';

const App = () => (

  <Admin
    title="SpotIn - Dashboard"
    theme={theme}
    history={history}
    dataProvider={dataProvider} authProvider={authProvider} >

    {permissions => [


      permissions === "admin" ? <Resource name="sports" list={SportList} edit={SportEdit} create={SportCreate} /> : null,
      permissions === "admin" ? <Resource name="competitions" list={CompetitionList} edit={CompetitionEdit} create={CompetitionCreate} /> : null,
      permissions === "admin" ? <Resource name="competitors" list={CompetitorList} edit={CompetitorEdit} create={CompetitorCreate}/> : null,
      permissions === "admin" ? <Resource name="businesses"
                                          list={BusinessList}
                                          options={{label: "Locali"}}
                                          create={BusinessCreate}
                                          edit={BusinessEdit}/> : null,
      permissions === "admin" ? <Resource name="events" list={EventList} edit={EventEdit} create={EventCreate}/>: null,
      permissions === "admin" ? <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />: null,
    ]}



  </Admin>


);
export default App;
