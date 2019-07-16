/* eslint-disable */
import { createMuiTheme } from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';

import deepPurple from '@material-ui/core/colors/deepPurple';

const spotinTheme = createMuiTheme({
  palette: {
    primary: {
      main: indigo['A400'],
      contrastText: '#fff',
    },
    secondary: {
      main: teal['A700'],
      contrastText: '#fafafa'
    },
  },
  overrides: {
    MuiAppBar: {
     colorSecondary: {
       backgroundColor: indigo['A400'],
     }
    },
    MuiButton: {
      raisedPrimary: {
        backgroundColor: teal['A700']
      }
    }
  }
});

export default spotinTheme;
