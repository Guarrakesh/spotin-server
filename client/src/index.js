import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  Switch
} from 'react-router-dom';
import { Provider } from 'react-redux';
import indexRoutes from './routes/index.jsx';

import registerServiceWorker from './registerServiceWorker';
import history from './history';

import './assets/css/bootstrap.min.css';
import './assets/sass/light-bootstrap-dashboard.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';

import configureStore from './store';

const store = configureStore();
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        {
          indexRoutes.map((prop,key) => {
            return (
              <Route path={prop.path} component={prop.component}  key={key}/>
            );
          })
        }
      </Switch>

    </Router>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
