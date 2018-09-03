import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import inflection from 'inflection';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';


import classNames from "classnames";
import {DashboardMenuItem, from, MenuItemLink, Responsive,  getResources, translate } from 'react-admin';
// @material-ui/core components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DefaultIcon from '@material-ui/icons/ViewList';
import Icon from "@material-ui/core/Icon";


import { NavLink } from "react-router-dom";
import sidebarStyle from "../assets/jss/material-dashboard-react/components/sidebarStyle.jsx";


const translatedResourceName = (resource, translate) =>
  translate(`resources.${resource.name}.name`, {
    smart_count: 2,
    _:
      resource.options && resource.options.label
        ? translate(resource.options.label, {
        smart_count: 2,
        _: resource.options.label,
      })
        : inflection.humanize(inflection.pluralize(resource.name)),
  });

const Menu = ({
  classes,
  className,
  dense,
  hasDashboard,
  onMenuClick,
  pathname,
  resources,
  translate,
  logout,
  color,
  ...rest
}) => {

  function activeRoute(routeName) {

    return pathname.indexOf(routeName) > -1 ? true : false;
  }

  function listItemClass(routeName) {
    return classNames({
      [" " + classes[color]]: activeRoute(routeName)
    });
  }
  return (
    <List className={classes.list}>
      {hasDashboard && <DashboardMenuItem onClick={onMenuClick} />}
      {resources
        .filter(r => r.hasList)
        .map(resource => (
          <NavLink
            to={`/${resource.name}`}
            className={classes.item}
            activeClassName="active"
            key={resource.name}
          >

            <ListItem button
                      onClick={onMenuClick}
                      className={classes.itemLink + listItemClass(resource.name)}
                      dense>

              <ListItemIcon button className={classes.itemIcon + classNames({[" " + classes.whiteFont]: activeRoute(resource.name)})}>
                {typeof resource.icon === "string" ? (
                  <Icon>{resource.icon}</Icon>
                ) : (
                  resource.icon ? <resource.icon/> : <DefaultIcon/>
                )}
              </ListItemIcon>
              <ListItemText
                primary={translatedResourceName(resource, translate)}
                className={classes.itemText + classNames({[" " + classes.whiteFont]: activeRoute(resource.name)})}
                disableTypography={true}
              />

            </ListItem>
          </NavLink>
        ))
      }
      <Responsive xsmall={logout} medium={null} />
    </List>
  )
}


Menu.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  dense: PropTypes.bool,
  hasDashboard: PropTypes.bool,
  logout: PropTypes.element,
  onMenuClick: PropTypes.func,
  pathname: PropTypes.string,
  resources: PropTypes.array.isRequired,
  translate: PropTypes.func.isRequired,
};

Menu.defaultProps = {
  onMenuClick: () => null,
  color: "purple"
};

const mapStateToProps = state => ({
  resources: getResources(state),
  pathname: state.routing.location.pathname, // used to force redraw on navigation
});

const enhance = compose(
  translate,
  connect(
    mapStateToProps,
    {}, // Avoid connect passing dispatch in props,
    null,
    {
      areStatePropsEqual: (prev, next) =>
      prev.resources.every(
        (value, index) => value === next.resources[index] // shallow compare resources
      ) && prev.pathname == next.pathname,
    }
  ),
  withStyles(sidebarStyle)
);

export default enhance(Menu);
