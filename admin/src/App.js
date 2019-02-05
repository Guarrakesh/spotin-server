import React from 'react';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import './App.css';


import Admin from './containers/admin';

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
