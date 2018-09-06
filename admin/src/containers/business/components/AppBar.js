import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { compose } from 'recompose';
import { connect } from 'react-redux';

// @material-ui/core components
/* eslint-disable */
import withStyles from "@material-ui/core/styles/withStyles";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";


// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import MoreVert from "@material-ui/icons/MoreVert";
import ViewList from "@material-ui/icons/ViewList";
/* eslint-enable */
// core components
import {LoadingIndicator, toggleSidebar as toggleSidebarAction} from 'react-admin';
import Button from "business/components/material-ui/CustomButtons/Button";
import appBarStyle from "business/assets/jss/material-dashboard-pro-react/components/headerStyle";

const AppBar = ({
  classes,
  rtlActive,
  open,
  title,
  toggleSidebar,
  color,
}) => {
  /*const makeBrand = () => {
   // var name;
   // props.routes.map((prop, key) => {
   //   if (prop.path === props.location.pathname) {
   //     name = prop.navbarName;
   //   }
   //   return null;
   // });
   // return name;
   return "Dashboard";
   }*/

  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });
  const sidebarMinimize =
    classes.sidebarMinimize +
    " " +
    classNames({
      [classes.sidebarMinimizeRTL]: rtlActive
    });
  return (
    <MuiAppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown implementation="css">
          <div className={sidebarMinimize}>

            <Button
              justIcon
              round
              color="white"
              onClick={toggleSidebar}>
                {!open ? <ViewList className={classes.sidebarMiniIcon}/> : <MoreVert className={classes.sidebarMiniIcon}/> }

            </Button>
          </div>
        </Hidden>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" className={classes.title}>
            {title}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          {/*<HeaderLinks />*/}
        </Hidden>
        <Hidden mdUp implementation="css">
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={toggleSidebar}
          >
            <Menu />
          </Button>
        </Hidden>
      </Toolbar>
      <LoadingIndicator className={classes.loadingIndicator} />
    </MuiAppBar>
  );
}

AppBar.defaultProps = {
  rtlActive: false,
};
AppBar.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  logout: PropTypes.element,
  open: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  rtlActive: PropTypes.bool,
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

export default enhance(AppBar);
