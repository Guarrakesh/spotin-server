import LoginPage from 'pages/Auth/LoginPage.jsx';
import RegisterPage from 'pages/Auth/RegisterPage.jsx';
import LockScreenPage from 'pages/Auth/LockScreenPage.jsx';

var authRoutes = [

  { path: "/auth/login", name: "Login Page", mini: "LP", component: LoginPage },

  { path: "/auth/lock-screen", name: "Lock Screen Page", mini: "LSP", component: LockScreenPage }
];

export default authRoutes;
