import React from 'react';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

import Admin from './containers/admin';

import './App.css';



class App extends React.Component {


  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Admin/>
      </MuiPickersUtilsProvider>
    )
  }


}
export default App;
