import React from 'react';
import { connect } from 'react-redux';
import { getAllSports, getFavoriteSports } from 'actions/sports';

import PropTypes from 'prop-types';


class SportPage extends React.Component {


  render() {

    const { sports } = this.props;


    if(!sports || sports.length === 0) return null;

    return (
      <div>

      </div>

    )
  }
}

SportPage.propTypes = {
  currentlySending: PropTypes.bool,
  sports: PropTypes.array.isRequired,
  loggedIn: PropTypes.bool
};

const mapStateToProps = state => {
  return({
    currentlySending: state.entities.currentlySending,

    sports: state.entities.sports,
    loggedIn: state.auth.loggedIn
  })
}

export default connect(mapStateToProps)(SportPage)
