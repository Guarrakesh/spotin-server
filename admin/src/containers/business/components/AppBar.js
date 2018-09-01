import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { compose } from 'recompose';
import { connect } from 'react-redux';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import {LoadingIndicator} from 'react-admin';
import { toggleSidebar as toggleSidebarAction } from 'ra-core';
import appBarStyle from "../assets/jss/material-dashboard-react/components/headerStyle.jsx";

const AppBar = ({
    classes,
   className,
   logout,
   open,
   title,
   toggleSidebar,
   color,
   ...rest
}) => {
  const makeBrand = () => {
    // var name;
    // props.routes.map((prop, key) => {
    //   if (prop.path === props.location.pathname) {
    //     name = prop.navbarName;
    //   }
    //   return null;
    // });
    // return name;
    return "Dashboard";
  }

  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });
  return (
    <MuiAppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" className={classes.title}>
            //{makeBrand()}
            {title}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          {/*<HeaderLinks />*/}
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
      <LoadingIndicator className={classes.loadingIndicator} />
    </MuiAppBar>
  );
}
AppBar.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    logout: PropTypes.element,
    open: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])

};

const enhance = compose(
  connect(
    state => ({
      locale: state.i18n.locale
    }),
    {
      toggleSidebar: toggleSidebarAction
    }
  ),
  withStyles(appBarStyle)
)

export default withStyles(appBarStyle)(AppBar);
