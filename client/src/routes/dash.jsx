import Dashboard from 'pages/Dashboard/Dashboard.jsx';
import Buttons from 'pages/Components/Buttons.jsx';
import GridSystem from 'pages/Components/GridSystem.jsx';
import Panels from 'pages/Components/Panels.jsx';
import SweetAlert from 'pages/Components/SweetAlertPage.jsx';
import Notifications from 'pages/Components/Notifications.jsx';
import Icons from 'pages/Components/Icons.jsx';
import Typography from 'pages/Components/Typography.jsx';
import RegularForms from 'pages/Forms/RegularForms.jsx';
import ExtendedForms from 'pages/Forms/ExtendedForms.jsx';
import ValidationForms from 'pages/Forms/ValidationForms.jsx';
import Wizard from 'pages/Forms/Wizard/Wizard.jsx';
import RegularTables from 'pages/Tables/RegularTables.jsx';
import ExtendedTables from 'pages/Tables/ExtendedTables.jsx';
import DataTables from 'pages/Tables/DataTables.jsx';
import GoogleMaps from 'pages/Maps/GoogleMaps.jsx';
import FullScreenMap from 'pages/Maps/FullScreenMap.jsx';
import VectorMap from 'pages/Maps/VectorMap.jsx';
import Charts from 'pages/Charts/Charts.jsx';
import Calendar from 'pages/Calendar/Calendar.jsx';
import UserPage from 'pages/Dashboard/UserPage.jsx';
import SportsPage from 'pages/Sports/SportsPage.jsx'
import SportPage from 'pages/Sports/SportPage.jsx';
import withAuthorization from 'hocs/withAuthorization';
import pagesRoutes from './auth.jsx';
//High order components per gestire l'autorizzazione alle varie route
const Manager = withAuthorization(['admin', 'manager']);
const Business = withAuthorization(['admin', 'business']);
const Admin = withAuthorization(['admin']);



var pages = [{ path: "/pages/user-page", name: "User Page", mini: "UP", component: UserPage }].concat(pagesRoutes);

var dashRoutes = [
  { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
  { path: '/sports/:id', name: "Sport", state: 'sport', icon: "", component: Admin(SportPage), sidebarHidden:true},
  { path: '/sports', name: "Sports", state: "openSports", icon: "", component: Admin(SportsPage)},
  /*{ collapse: true, path: "/components", name: "Components", state: "openComponents", icon: "pe-7s-plugin", views:[
   { path: "/components/buttons", name: "Buttons", mini: "B", component: Buttons },
   { path: "/components/grid-system", name: "Grid System", mini: "GS", component: GridSystem },
   { path: "/components/panels", name: "Panels", mini: "P", component: Panels },
   { path: "/components/sweet-alert", name: "Sweet Alert", mini: "SA", component: SweetAlert },
   { path: "/components/notifications", name: "Notifications", mini: "N", component: Notifications },
   { path: "/components/icons", name: "Icons", mini: "I", component: Icons },
   { path: "/components/typography", name: "Typography", mini: "T", component: Typography }]
   },
   { collapse: true, path: "/forms", name: "Forms", state: "openForms", icon: "pe-7s-note2", views:
   [{ path: "/forms/regular-forms", name: "Regular Forms", mini: "RF", component: RegularForms },
   { path: "/forms/extended-forms", name: "Extended Forms", mini: "EF", component: ExtendedForms },
   { path: "/forms/validation-forms", name: "Validation Forms", mini: "VF", component: ValidationForms },
   { path: "/forms/wizard", name: "Wizard", mini: "W", component: Wizard }]
   },
   { collapse: true, path: "/tables", name: "Tables", state: "openTables", icon: "pe-7s-news-paper", views:
   [{ path: "/tables/regular-tables", name: "Regular Tables", mini: "RT", component: RegularTables },
   { path: "/tables/extended-tables", name: "Extended Tables", mini: "ET", component: ExtendedTables },
   { path: "/tables/data-tables", name: "Data Tables", mini: "DT", component: DataTables }]
   },
   { collapse: true, path: "/maps", name: "Maps", state: "openMaps", icon: "pe-7s-map-marker", views:
   [{ path: "/maps/google-maps", name: "Google Maps", mini: "GM", component: GoogleMaps },
   { path: "/maps/full-screen-maps", name: "Full Screen Map", mini: "FSM", component: FullScreenMap },
   { path: "/maps/vector-maps", name: "Vector Map", mini: "VM", component: VectorMap }]
   },*/
  /* { path: "/charts", name: "Charts", icon: "pe-7s-graph1", component: Charts },
   { path: "/calendar", name: "Calendar", icon: "pe-7s-date", component: Calendar },
   { collapse: true, path: "/pages", name: "Pages", state: "openPages", icon:"pe-7s-gift", views:
   pages
   },*/
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];
export default dashRoutes;
