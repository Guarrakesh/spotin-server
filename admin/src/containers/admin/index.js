import React from 'react';
import {Admin as AdminBase, Resource, ShowGuesser} from 'react-admin';
import italianMessages from 'ra-language-italian'; // eslint-disable-line
import englishMessages from 'ra-language-english';
import SettingCreate from "./resources/settings/SettingCreate";
import SettingEdit from './resources/settings/SettingEdit';
import SettingList from './resources/settings/SettingList';

import { UserList, UserEdit, UserCreate } from './resources/users';
import { SportList, SportEdit, SportCreate } from './resources/sports';
import { CompetitionList, CompetitionEdit, CompetitionCreate } from './resources/competitions';
import { BusinessList, BusinessEdit, BusinessCreate } from './resources/businesses';
import { EventList, EventEdit, EventCreate } from './resources/events';
import { CompetitorList, CompetitorEdit, CompetitorCreate } from './resources/competitors';
import { BroadcastList, BroadcastCreate, BroadcastEdit } from './resources/broadcasts/broadcasts';

import {ReservationList, ReservationShow} from './resources/reservations';
import { BroadcastRequestList, BroadcastRequestShow } from './resources/broadcastRequests';
import { BroadcastBundleList, BroadcastBundleCreate, BroadcastBundleShow, BroadcastBundleEdit } from "./resources/broadcastBundle";
import dataProvider from '../../providers/dataProvider';
import authProvider from '../../providers/authProvider';
import history from '../../history';
import theme from './theme';
import { CouponCodeCreate, CouponCodeList,CouponCodeShow  } from './resources/coupon';
import { PrizeList, PrizeCreate, PrizeEdit } from './resources/prizes'
/* eslint-disable */
const AdminRoutes = [
  <Resource name="sports" list={SportList} edit={SportEdit} create={SportCreate} />,
  <Resource name="competitions" list={CompetitionList} edit={CompetitionEdit} create={CompetitionCreate}/>,
  <Resource name="competitors" list={CompetitorList} edit={CompetitorEdit} create={CompetitorCreate}/>,
  <Resource name="businesses" list={BusinessList} options={{label: "Businesses"}} create={BusinessCreate} edit={BusinessEdit}/>,
  <Resource name="events" list={EventList} edit={EventEdit} create={EventCreate}/>,

  <Resource name="users" list={UserList}
            options={{label: "Utenti"}}
            edit={UserEdit} create={UserCreate} />,
  <Resource name="broadcasts" list={BroadcastList} create={BroadcastCreate} edit={BroadcastEdit} />,
  <Resource name="reservations"
            options={{label: "Prenotazioni"}}
            list={ReservationList}
            show={ReservationShow}
  />,
  <Resource name="requests" list={BroadcastRequestList}
            options={{label: "Richieste Broadcast"}}
            show={BroadcastRequestShow}/>,

  <Resource name="broadcastbundles" options={{label:"Bundles"}} list={BroadcastBundleList} edit={BroadcastBundleEdit}
            create={BroadcastBundleCreate} show={BroadcastBundleShow}/>,
  <Resource
      name="settings"
      options={{ label: "Impostazioni"}}
      list={SettingList}

      create={SettingCreate}
      show={ShowGuesser}
      edit={SettingEdit}/>,
    <Resource name="coupons"
              options={{ label: "Spot Coin coupon"}}
              list={CouponCodeList}
              show={CouponCodeShow}
              create={CouponCodeCreate}/>,
    <Resource name="prizes"
              edit={PrizeEdit}
              list={PrizeList}
              create={PrizeCreate}
              />
];

const messages = {
  it: italianMessages,
  en: englishMessages,
};
const i18nProvider = locale => messages[locale];
/* eslint-enable */
const Admin = () => (

    <AdminBase dataProvider={dataProvider}
               authProvider={authProvider}
               locale="it" i18nProvider={i18nProvider}
               theme={theme}
               history={history}
    >
      {AdminRoutes}
    </AdminBase>

);
export default Admin;
