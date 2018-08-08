import React, {Component} from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';

import Footer from 'components/Footer/Footer.jsx';
import AuthHeader from 'components/Header/AuthHeader.jsx';

// dinamically create pages routes
import authRoutes from '../../routes/auth.jsx';

import bgImage from 'assets/img/full-screen-image-1.jpg';

class Auth extends Component{
  getPageClass(){
    var pageClass = "";
    switch (this.props.location.pathname) {
      case "/":
      case "/auth/login":
        pageClass = " login-page";
        break;
      case "/auth/register":
        pageClass = " register-page";
        break;
      case "/auth/lock-screen":
        pageClass = " lock-page";
        break;
      default:
        pageClass = "";
        break;
    }
    return pageClass;
  }
  componentWillMount(){
    if(document.documentElement.className.indexOf('nav-open') !== -1){
      document.documentElement.classList.toggle('nav-open');
    }
  }
  render(){
    return (
      <div>

        <div className="wrapper wrapper-full-page">
          <div className={"full-page"+this.getPageClass()} data-color="black" data-image={bgImage}>
            <div className="content">
              <Switch>
                {
                  authRoutes.map((prop,key) => {
                    return (
                      <Route path={prop.path} component={prop.component}  key={key}/>
                    );
                  })
                }
              </Switch>
            </div>
            <Footer transparent/>
            <div className="full-page-background" style={{backgroundImage: "url("+bgImage+")"}}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;
