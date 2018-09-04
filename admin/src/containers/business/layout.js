import React, { createElement  }from 'react';
import PropTypes from 'prop-types';
import {
    MuiThemeProvider,
    createMuiTheme,
    withStyles,
} from '@material-ui/core/styles'; //eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux'; //eslint-disable-line import/no-extraneous-dependencies
import { compose } from 'recompose';
import { withRouter } from 'react-router'; //eslint-disable-line import/no-extraneous-dependencies


import { Notification, Error, defaultTheme } from 'react-admin';

import businessStyle from 'business/assets/jss/material-dashboard-pro-react/layouts/dashboardStyle';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import Menu from './components/Menu';
import sidebarImage from "./assets/img/sidebar-4.jpg";


/*const sanitizeRestProps = ({
    staticContext,
    history,
    location,
    match,
    ...props
}) => props;*/

class BusinessLayout extends React.Component {
  state = { hasError: false, errorMessage: null, errorInfo: null };

  constructor(props) {
    super(props);
    props.history.listen(() => {
      if (this.state.hasError) {
        this.setState({hasError: false});
      }
    })
  }
  componentDidCatch(errorMessage, errorInfo) {
    this.setState({ hasError: true, errorMessage, errorInfo});
  }



  render() {
    const {
          appBar,
          children,
          classes,
          error,
          dashboard,
          logout,
          menu,
          open,
          title,
          notification
        } = this.props;
     const { hasError, errorMessage, errorInfo } = this.state;
     return (
    <div className={classes.wrapper}>
      <Sidebar image={sidebarImage}>
        {createElement(menu, {
          logout,
          hasDashboard: !! dashboard
        })}
      </Sidebar>
      <div className={classes.mainPanel}>
          {createElement(appBar, { title, open, logout})}
          <div className={classes.content}>
            <div className={classes.container}>
              {hasError
                ? createElement(error, {
                  error: errorMessage,
                  errorInfo,
                })
                : children }
            </div>
          </div>
          {createElement(notification)}
      </div>
    </div>
  )
  }
}
const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);
BusinessLayout.propTypes = {
  appBar: componentPropType,
  classes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dashboard: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  isLoading: PropTypes.bool.isRequired,
  logout: componentPropType,
  setSidebarVisibility: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  customRoutes: PropTypes.array,
  open: PropTypes.bool,
  menu: componentPropType,
  history: PropTypes.object.isRequired,
  error: componentPropType,
  notification: componentPropType

};

BusinessLayout.defaultProps = {
  appBar: AppBar,
  error: Error,
  menu: Menu,
  notification: Notification
}

const mapStateToProps = state => ({
  isLoading: state.admin.loading > 0,
  open: state.admin.ui.sidebarOpen
});

const EnhancedLayout = compose(
  connect(
    mapStateToProps,
    {}
  ),
  withRouter,
  withStyles(businessStyle)
)(BusinessLayout);

class LayoutWithTheme extends React.Component {
  constructor(props) {
    super(props);
    this.theme = createMuiTheme(props.theme);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.theme !== this.props.theme) {
      this.theme = createMuiTheme(nextProps.theme);
    }
  }

  render() {
    const {...rest} = this.props;
    return (
      <MuiThemeProvider theme={this.theme}>
        <EnhancedLayout {...rest}/>
      </MuiThemeProvider>
    )
  }
}

LayoutWithTheme.propTypes = {
  theme: PropTypes.object
};

LayoutWithTheme.defaultProps = {
  theme: defaultTheme
}
export default LayoutWithTheme;
