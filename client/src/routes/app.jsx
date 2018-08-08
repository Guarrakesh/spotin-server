import Auth from 'containers/Auth/Auth.jsx';
import Dash from 'containers/Dash/Dash.jsx';
import withAuthorization from 'hocs/withAuthorization';


const Logged = withAuthorization(['admin','manager','business']);

var appRoutes = [
    { path: "/auth/login", name: "Auth", component: Auth },
    { path: "/auth/register", name: "Auth", component: Auth },
    { path: "/auth/lock-screen", name: "Auth", component: Auth },
    { path: "/", name: "Home", component: Logged(Dash)}
];

export default appRoutes;
