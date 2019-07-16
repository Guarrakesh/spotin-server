/* eslint-disable */
import { createMuiTheme } from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';

import deepPurple from '@material-ui/core/colors/deepPurple';

const spotinTheme = createMuiTheme({
  palette: {
    primary: {
      main: teal['A700'],
      contrastText: '#fff',
    },
    secondary: {
      main: indigo['A400'],
      contrastText: '#fafafa'
    },

  }
});

export default spotinTheme;
