import EventsIcon from '@material-ui/icons/AccountTree'
import CouponsIcon from '@material-ui/icons/ConfirmationNumber'
import ContactRequestsIcon from '@material-ui/icons/ContactSupport'
import CompetitorsIcon from '@material-ui/icons/EmojiEvents';
import PrizesIcon from '@material-ui/icons/Euro';
import SportEventsIcon from '@material-ui/icons/Event';
import ReservationsIcon from '@material-ui/icons/EventSeat';
import BroadcastBundlesIcon from '@material-ui/icons/GroupWork';
import BroadcastsIcon from '@material-ui/icons/LiveTv';
import CompetitionsIcon from '@material-ui/icons/LocalActivity';
import UsersIcon from '@material-ui/icons/Person';
import BusinessesIcon from '@material-ui/icons/Restaurant';
import SettingsIcon from '@material-ui/icons/Settings'
import SportsIcon from '@material-ui/icons/Sports';
import LayoutElementsIcon from '@material-ui/icons/ViewAgenda';
import AppLayoutBlocksIcon from '@material-ui/icons/ViewQuilt';
import CampaignsIcon from '@material-ui/icons/WbIncandescent';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import italianMessages from 'ra-language-italian'; // eslint-disable-line
import React from 'react';
import {Admin as AdminBase, ListGuesser, Resource, ShowGuesser} from 'react-admin';
import history from '../../history';
import authProvider from '../../providers/authProvider';
import dataProvider from '../../providers/dataProvider';
import {AppLayoutBlockCreate, AppLayoutBlockEdit, AppLayoutBlockList} from './resources/applayoutblocks';
import {
  BroadcastBundleCreate,
  BroadcastBundleEdit,
  BroadcastBundleList,
  BroadcastBundleShow
} from "./resources/broadcastBundle";
import {BroadcastRequestList, BroadcastRequestShow} from './resources/broadcastRequests';
import {BroadcastCreate, BroadcastEdit, BroadcastList} from './resources/broadcasts/broadcasts';
import {BusinessCreate, BusinessEdit, BusinessList} from './resources/businesses';
import {CompetitionCreate, CompetitionEdit, CompetitionList} from './resources/competitions';
import {CompetitorCreate, CompetitorEdit, CompetitorList} from './resources/competitors';
import {CouponCodeCreate, CouponCodeList, CouponCodeShow} from './resources/coupon';
import {EventEdit, EventList, EventCreate} from './resources/events';

import {PrizeCreate, PrizeEdit, PrizeList} from './resources/prizes'

import {ReservationList, ReservationShow} from './resources/reservations';
import SettingCreate from "./resources/settings/SettingCreate";
import SettingEdit from './resources/settings/SettingEdit';
import SettingList from './resources/settings/SettingList';
import {SportEventCreate, SportEventEdit, SportEventList} from './resources/sportevents';
import {SportCreate, SportEdit, SportList} from './resources/sports';
import { CampaignList, CampaignCreate } from './resources/campaigns';

import {UserCreate, UserEdit, UserList} from './resources/users';
import theme from './theme';
/* eslint-disable */
const AdminRoutes = [
  <Resource name="sports" icon={SportsIcon} list={SportList} edit={SportEdit} create={SportCreate} />,
  <Resource name="competitions" icon={CompetitionsIcon} list={CompetitionList} edit={CompetitionEdit} create={CompetitionCreate}/>,
  <Resource name="competitors" icon={CompetitorsIcon} list={CompetitorList} edit={CompetitorEdit} create={CompetitorCreate}/>,
  <Resource name="businesses" icon={BusinessesIcon} list={BusinessList} options={{label: "Businesses"}} create={BusinessCreate} edit={BusinessEdit}/>,
  <Resource name="events" icon={SportEventsIcon} list={SportEventList} edit={SportEventEdit} create={SportEventCreate}/>,

  <Resource name="users" icon={UsersIcon} list={UserList}
            options={{label: "Utenti"}}
            edit={UserEdit} create={UserCreate} />,
  <Resource name="broadcasts" icon={BroadcastsIcon} list={BroadcastList} create={BroadcastCreate} edit={BroadcastEdit} />,
  <Resource name="reservations"
            options={{label: "Prenotazioni"}}
            icon={ReservationsIcon}
            list={ReservationList}
            show={ReservationShow}
  />,
  <Resource name="requests" list={BroadcastRequestList}
            options={{label: "Richieste Broadcast"}}
            icon={ContactRequestsIcon}
            show={BroadcastRequestShow}/>,

  <Resource name="broadcastbundles" options={{label:"Bundles"}} list={BroadcastBundleList} edit={BroadcastBundleEdit}
            icon={BroadcastBundlesIcon}
            create={BroadcastBundleCreate} show={BroadcastBundleShow}/>,

    <Resource name="campaigns" list={CampaignList} create={CampaignCreate}
              icon={CampaignsIcon}
              />,
  <Resource name="coupons"
            icon={CouponsIcon}
            options={{ label: "Spot Coin coupon"}}
            list={CouponCodeList}
            show={CouponCodeShow}
            create={CouponCodeCreate}/>,
  <Resource name="prizes"
            edit={PrizeEdit}
            icon={PrizesIcon}
            list={PrizeList}
            create={PrizeCreate}
  />,
  <Resource name="app-layout-blocks"
            create={AppLayoutBlockCreate}
            icon={AppLayoutBlocksIcon}
            list={AppLayoutBlockList}
            edit={AppLayoutBlockEdit}
            options={{ label: 'Layout Blocks'}}
  />,
  <Resource name="layout-elements"
            icon={LayoutElementsIcon}
            list={ListGuesser}
            options={{ label: 'Layout Elements'}}
  />,
  <Resource
      name="systemevents"
      options={{ label: "Eventi di sistema"}}
      list={EventList}
      icon={EventsIcon}
      create={EventCreate}
      edit={EventEdit}/>,
  <Resource
      name="settings"
      options={{ label: "Impostazioni"}}
      list={SettingList}
      icon={SettingsIcon}
      create={SettingCreate}
      show={ShowGuesser}
      edit={SettingEdit}/>,

];

const messages = {
  it: italianMessages,
  en: englishMessages,
};

const i18nProvider = polyglotI18nProvider(locale => messages[locale], 'it');

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
