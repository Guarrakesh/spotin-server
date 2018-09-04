/* eslint-disable */
import { createMuiTheme } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';
import deepPurple from '@material-ui/core/colors/deepPurple';


const spotinTheme = createMuiTheme({
  palette: {
    type: 'light',

    secondary: {
      main: deepPurple[400]
    }

  },
  overrides: {
    MuiDrawer: {
    
      docked: { backgroundColor: deepPurple[400]}
    }
  }
});

export default spotinTheme;
