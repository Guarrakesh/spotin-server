import React from 'react';


import PropTypes from 'prop-types';
import { connect } from 'react-redux'; //eslint-disable import/no-extraneous-dependencies
import { NavLink } from 'react-router-dom';
import compose from 'recompose/compose';
// React-admin components
import { Responsive, setSidebarVisibility } from 'react-admin';
import cx from 'classnames';

//Custom actions
import { changeBusiness as changeBusinessAction } from 'business/actions';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import withWidth from '@material-ui/core/withWidth';
import Drawer from '@material-ui/core/Drawer';
import sidebarStyle from  "business/assets/jss/material-dashboard-pro-react/components/sidebarStyle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import SpotInLogo from 'business/assets/img/SpotinIcon-outline.png';


class SidebarWrapper extends React.Component  {
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      /*ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
       suppressScrollX: true,
       suppressScrollY: false
       });*/
    }
  }
  /*componentWillUnmount() {
   if (navigator.platform.indexOf("Win") > -1) {
   ps.destroy();
   }
   }*/

  static propTypes = {
    className: PropTypes.string,
    business: PropTypes.node,
    headerLinks: PropTypes.node,
    links: PropTypes.node.isRequired,
    bgColor: PropTypes.string,

  };
  render() {
    const { className, business, headerLinks, links } = this.props;
    return (
      <div className={className}>
        {business}
        {headerLinks}
        {links}
      </div>
    );
  }
}



class SidebarBusinessArea extends React.Component {
  state = {avatarOpen: false};

  getInitials = (name) => {
    const chunks = name.split(' ');
    if (chunks.length == 1) return chunks[0].substring(0,2);
    else if (chunks.length >= 2) return `${chunks[0].substring(0,1)}${chunks[1].substring(0,1)}`;
    else return name;
  }
  toggleAvatarOpen() {
    this.setState({ avatarOpen: !this.state.avatarOpen});
  }
  render() {
    const {
      rtlActive,
      classes,
      bgColor,
      open,
      businesses,
      handleBusinessChange,
      miniActive,
      business} = this.props;

    const { avatarOpen } = this.state;
    const itemText =
      classes.itemText +
      " " +
      cx({
        [classes.itemTextMini]: !open && miniActive,
        [classes.itemTextMiniRTL]: rtlActive && !open && miniActive,
        [classes.itemTextRTL]: rtlActive
      });
    const collapseItemText =
      classes.collapseItemText +
      " " +
      cx({
        [classes.collapseItemTextMini]: !open && miniActive,
        [classes.collapseItemTextMiniRTL]: rtlActive && !open && miniActive,
        [classes.collapseItemTextRTL]: rtlActive
      });
    const userWrapperClass =
      classes.user +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    const caret =
      classes.caret +
      " " +
      cx({
        [classes.caretRTL]: rtlActive
      });
    const collapseItemMini =
      classes.collapseItemMini +
      " " +
      cx({
        [classes.collapseItemMiniRTL]: rtlActive
      });
    const photo =
      classes.photo +
      " " +
      cx({
        [classes.photoRTL]: rtlActive
      });
    return (
      <div className={userWrapperClass}>
        <div className={photo}>
          <img src={business.name} className={classes.avatarImg} alt="..." />
        </div>
        <List className={classes.list}>

          <ListItem className={classes.item + " " + classes.userItem}>
            <NavLink
              to={"#"}
              className={classes.itemLink + " " + classes.userCollapseButton}
              onClick={this.toggleAvatarOpen.bind(this)}
            >
              <ListItemText
                primary={business.name}
                secondary={
                  <b
                    className={
                      caret +
                      " " +
                      classes.userCaret +
                      " " +
                      (avatarOpen ? classes.caretActive : "")
                    }
                  />
                }
                disableTypography={true}
                className={itemText + " " + classes.userItemText}
              />
            </NavLink>
            <Collapse in={avatarOpen} unmountOnExit>
              <List className={classes.list + " " + classes.collapseList}>
                {businesses.filter(bus => bus._id !== business._id)
                  .map(item =>
                      <ListItem key={item._id} className={classes.collapseItem}>
                        <NavLink
                          to={'#'}
                          onClick={() => handleBusinessChange(item._id)}
                          className={
                            classes.itemLink + " " + classes.userCollapseLinks
                          }
                        >
                <span className={collapseItemMini}>
                  {this.getInitials(item.name)}
                </span>
                          <ListItemText
                            primary={item.name}
                            disableTypography={true}
                            className={collapseItemText}
                          />
                        </NavLink>
                      </ListItem>


                  )}
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    );
  }


}

SidebarBusinessArea.propTypes = {
  rtlActive: PropTypes.bool,
  miniActive: PropTypes.bool,
  classes: PropTypes.object,
  business: PropTypes.object,
  bgColor: PropTypes.string,
  open: PropTypes.bool,
  handleBusinessChange: PropTypes.func,
  businesses: PropTypes.array,

};
SidebarBusinessArea.defaultProps = {
  bgColor: "purple",
};









class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      miniActive: true, //Si attiva quando il mouse passa sopra la miniSidebar, è uno stato interno, che non ha effetto
      //quando la sidebar è fissata
    }
  }
  componentDidMount() {
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
      business,
      classes,
      open,
      image,
      bgColor,
      rtlActive,
      changeBusiness,
      businesses,
      ...rest
    } = this.props;

    const { miniActive } = this.state;
    if (!business) return null;


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
    const logoNormal =
      classes.logoNormal +
      " " +
      cx({
        [classes.logoNormalSidebarMini]: !open && miniActive,
        [classes.logoNormalSidebarMiniRTL]: rtlActive && !open && miniActive,
        [classes.logoNormalRTL]: rtlActive
      });
    const logoMini =
      classes.logoMini +
      " " +
      cx({
        [classes.logoMiniRTL]: rtlActive && miniActive
      });
    const logoClasses =
      classes.logo +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    var brand = (
      <div className={logoClasses}>
        <a href="/" className={logoMini}>
          <img src={SpotInLogo} alt="logo" className={classes.img} />
        </a>
        <a href="/" className={logoNormal}>
          {"Spot IN"}
        </a>
      </div>
    );
    const drawerPaper =
      classes.drawerPaper +
      " " +
      cx({
        [classes.drawerPaperMini]: !open && miniActive,
        [classes.drawerPaperRTL]: rtlActive
      });
    const sidebarWrapper =
      classes.sidebarWrapper +
      " " +
      cx({
        [classes.drawerPaperMini]: !open && miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1
      });

    return (
      <Responsive
        small={
          <Drawer
            variant="temporary"
            anchor={rtlActive ? "left" : "right"}
            open={open}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
            onClose={this.toggleSidebar.bind(this)}
            {...rest}
            ModalProps={{ keepMounted: true }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              headerLinks={null}
              business={<SidebarBusinessArea
                miniActive={miniActive}
                classes={classes}
                business={business} //Locale corrente
                businesses={businesses} //Altri locali
                handleBusinessChange={changeBusiness}
                open={open}
                bgColor={bgColor}
                rtlActive={rtlActive}
              />}
              links={React.cloneElement(children, {
                onMenuClick: this.handleClose, rtlActive,
                dense: true
              })}
            />

            {image !== undefined ? (
              <div className={classes.background}
                   style={{ backgroundImage: "url("+image+")"}}
              /> ) : null }
          </Drawer>
        }

        medium={
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() =>  this.setState({ miniActive: true })}
            //Perché c'è da gestire il caso in cui la sidebar sia fissata e quindi questi due eventi non devono influiscono
            anchor={rtlActive ? "right" : "left"}
            variant="permanent"
            open={false}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              headerLinks={null}
              business={<SidebarBusinessArea
                classes={classes}
                miniActive={miniActive}
                business={business}
                businesses={businesses}
                handleBusinessChange={changeBusiness}
                open={open}
                bgColor={bgColor}
                rtlActive={rtlActive}
              />}
              links={React.cloneElement(children, {
                rtlActive: rtlActive,
                dense: true,
                sidebarOpen: open,
                miniActive: miniActive
              })}
            />
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

Sidebar.defaultProps = {
  bgColor: "black",
  rtlActive: false,
};
Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object,
  open: PropTypes.bool.isRequired,
  setSidebarVisibility: PropTypes.func.isRequired,
  changeBusiness: PropTypes.func.isRequired,
  width: PropTypes.string,
  image: PropTypes.node,
  bgColor: PropTypes.oneOf(["white", "black", "blue", "purple"]),
  rtlActive: PropTypes.bool, // Per ora è gestito nello state interno, successivamente si può volerlo gestire nello state
  business: PropTypes.object,
  businesses: PropTypes.array,
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose"
  ]),

};

const mapStateToProps = state => ({

  open: state.admin.ui.sidebarOpen,
  locale: state.locale
});

export default compose(
  connect(
    mapStateToProps,
    { setSidebarVisibility, changeBusiness: changeBusinessAction }
  ),
  withStyles(sidebarStyle),
  withWidth()
)(Sidebar);
