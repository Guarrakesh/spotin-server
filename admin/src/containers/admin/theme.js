/* eslint-disable */
import { createMuiTheme } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';
import deepPurple from '@material-ui/core/colors/deepPurple';

const spotinTheme = createMuiTheme({
  palette: {
    secondary: {
      main: green['A400'],
      contrastText: '#fafafa'
    },
    primary: deepPurple,

  }
});

export default spotinTheme;
