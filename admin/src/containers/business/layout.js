import React, { createElement  }from 'react';
import PropTypes from 'prop-types';
import {
    MuiThemeProvider,
    createMuiTheme,
    withStyles,
} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import { setSidebarVisibility, Notification, Error, Menu, defaultTheme } from 'react-admin';

import businessStyle from './assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';

import sidebarImage from "./assets/img/sidebar-4.jpg";
const sanitizeRestProps = ({
    staticContext,
    history,
    location,
    match,
    ...props
}) => props;

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
          className,
          customRoutes,
          error,
          dashboard,
          logout,
          menu,
          notification,
          open,
          title,
          ...props
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
      <div className={classes.mainPanel} ref="mainPanel">
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.theme !== this.props.theme) {
      this.theme = createMuiTheme(nextProps.theme);
    }
  }

  render() {
    const { theme, ...rest} = this.props;
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