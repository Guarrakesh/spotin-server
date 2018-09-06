import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { translate } from 'react-admin';
/* eslint-disable */

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from '@material-ui/icons/Dashboard';
/* eslint-enable */

const DashboardMenuItem = ({
  className,
  onClick,
  translate,
  textClassName,
  iconClassName,
  linkClassName,
  dense}) => {



  return (
    <NavLink
      to="/"
      className={linkClassName}
      activeClassName="active"
      key="dashboard"
      exact
    >

      <ListItem button={true}
                onClick={onClick}
                className={className}
                dense={dense}>

        <ListItemIcon className={iconClassName}>
          <DashboardIcon/>
        </ListItemIcon>
        <ListItemText
          primary={translate('ra.page.dashboard')}
          className={textClassName}
          disableTypography={true}
        />

      </ListItem>
    </NavLink>

  )
}

DashboardMenuItem.propTypes = {
  classes: PropTypes.object,
  dense: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  translate: PropTypes.func.isRequired,
  pathname: PropTypes.string,
  iconClassName: PropTypes.string,
  textClassName: PropTypes.string,
  linkClassName: PropTypes.string
};

export default translate(DashboardMenuItem);
