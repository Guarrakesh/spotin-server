import React, {Component} from 'react';
import {
  Switch,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';

import { connect } from 'react-redux';
// this is used to create scrollbars on windows devices like the ones from apple devices
import * as Ps from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.min.css';
// react component that creates notifications (like some alerts with messages)
import Notifications from 'react-notification-system-redux';

import Sidebar from 'components/Sidebar/Sidebar.jsx';
import Header from 'components/Header/Header.jsx';
import Footer from 'components/Footer/Footer.jsx';

// dinamically create dashboard routes
import dashRoutes from 'routes/dash.jsx';

// style for notifications
import { style } from "variables/Variables.jsx";

class Dash extends Component{
  constructor(props){
    super(props);

  }
  componentDidMount(){



    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      Ps.initialize(this.refs.mainPanel, { wheelSpeed: 2, suppressScrollX: true });
    }
  }

  // function that creates perfect scroll bar for windows users (it creates a scrollbar that looks like the one from apple devices)
  isMac(){
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }
  componentDidUpdate(e){
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      setTimeout(() => { Ps.update(this.refs.mainPanel) }, 350);
    }
    if(e.history.action === "PUSH"){
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  componentWillMount(){
    if(document.documentElement.className.indexOf('nav-open') !== -1){
      document.documentElement.classList.toggle('nav-open');
    }
  }
  render(){
    const { notifications } = this.props;
    return (
      <div className="wrapper">
        <Notifications ref="notificationSystem" style={style}
          notifications={notifications}/>
        <Sidebar {...this.props} />
        <div className={"main-panel"+(this.props.location.pathname === "/maps/full-screen-maps" ? " main-panel-maps":"")} ref="mainPanel">
          <Header {...this.props}/>
          <Switch>
            {
              dashRoutes.map((prop,key) => {
                if(prop.collapse){
                  return prop.views.map((prop,key) => {
                    return (
                        <Route path={prop.path} component={prop.component} key={key}/>
                      );
                  });

                } else {
                  if(prop.redirect)
                    return (
                      <Redirect from={prop.path} to={prop.pathTo} key={key}/>
                    );
                  else
                    return (
                      <Route path={prop.path} component={prop.component} key={key}/>
                    );
                }
              })
            }
          </Switch>
          <Footer fluid/>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    notifications: state.notifications,

  }
}
export default withRouter(connect(mapStateToProps)(Dash));
