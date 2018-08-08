import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const withAuthorization = roles => (Component) => {

  class AuthorizedComponent extends React.Component {


    render() {

      const { role } = this.props.user;
      const { loggedIn } = this.props;
      if (!loggedIn) {
        return <Redirect to="/auth/login"/>
      } else if (roles.includes(role)) {
        return <Component { ...this.props }/>
      } else {
        return <h1>Spiacenti, non hai il permesso di accedere a questo contenuto</h1>
      }

    }
  }


  const mapStateToProps = (state) => ({
    token: state.auth.token,
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  });

  return connect(mapStateToProps)(AuthorizedComponent)
}


export default withAuthorization;
