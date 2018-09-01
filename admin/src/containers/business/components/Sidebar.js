import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
// React-admin components
import { Responsive } from 'react-admin';
import { setSidebarVisibility } from 'ra-core';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import withWidth from '@material-ui/core/withWidth';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import sidebarStyle from  "../assets/jss/material-dashboard-react/components/sidebarStyle.jsx";
class Sidebar extends React.Component {
  componentWillMount() {
    const { width, setSidebarVisibility } = this.props;
    if (width !== 'xs' && width !== 'sm') {
      setSidebarVisibility(true);
    }
  }
  handleClose = () => this.props.setSidebarVisibility(false);
  toggleSidebar = () => this.props.setSidebarVisibility(!this.props.open);

  render() {
    const {
      children,
      classes,
      open,
      setSidebarVisibility,
      width,
      image,
      ...rest
    } = this.props;

    // const brand = (
    //   <div className={classes.logo}>
    //     <a href="https://www.creative-tim.com" className={classes.logoLink}>
    //       <div className={classes.logoImage}>
    //         <img src={logo} alt="logo" className={classes.img} />
    //       </div>
    //       {logoText}
    //     </a>
    //   </div>
    // );
    const brand = (
      <div className={classes.logo}>
      SpotIn
      </div>
    )
    return (
      <Responsive
        small={
          <Drawer
            variant="temporary"
            anchor="right"
            open={open}
            classes={{
              pape: classes.drawerPaper
            }}
            onClose={this.toggleSidebar}
            {...rest}
            ModalProps={{ keepMounted: true }}
          >
          {brand}
          <div className={classes.sidebarWrapper}>
            {React.cloneElement(children, {
              onMenuClick: this.handleClose,
              dense: true
            })}
          </div>
          {image !== undefined ? (
          <div className={classes.background}
            style={{ backgroundImage: "url("+image+")"}}
          /> ) : null }
          </Drawer>
        }

        medium={
          <Drawer
            anchor="left"
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {brand}
            <div className={classes.sidebarWrapper}>
              {React.cloneElement(children, {
              //  onMenuClick: this.handleClose,
                dense: true
              })}
            </div>
            {image !== undefined ? (
            <div className={classes.background}
              style={{ backgroundImage: "url("+image+")"}}
            /> ) : null }
          </Drawer>
        }
      />
    )

  }
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object,
  open: PropTypes.bool.isRequired,
  setSidebarVisibility: PropTypes.func.isRequired,
  width: PropTypes.string
};

const mapStateToProps = state => ({
  open: state.admin.ui.sidebarOpen,
  locale: state.locale
});

export default compose(
  connect(
    mapStateToProps,
    { setSidebarVisibility }
  ),
  withStyles(sidebarStyle),
  withWidth()
)(Sidebar);
