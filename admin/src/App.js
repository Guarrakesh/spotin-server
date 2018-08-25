import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Admin, Resource } from 'react-admin';

import dataProvider from './providers/dataProvider';
import authProvider from './providers/authProvider';

import { PostList, PostEdit, PostCreate } from './resources/posts';
import { UserList } from './resources/users';
import { SportList, SportEdit, SportCreate } from './resources/sports';
import { CompetitionList, CompetitionEdit, CompetitionCreate } from './resources/competitions';

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
    ]}



  </Admin>


);
export default App;
