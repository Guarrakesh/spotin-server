import React from 'react';
import { connect } from 'react-redux';
import { saveSportRequest } from 'actions/sports';

import PropTypes from 'prop-types';
import {Row, Col} from 'react-bootstrap';
import SportForm from 'components/Sports/SportForm.jsx';
class NewSportPage extends React.Component {

  onSubmit(sport) {
    this.props.dispatch(saveSportRequest(sport, true));
  }

  render() {
    const sport = {};
    const error = this.props.error;
    return (
      <div className="main-content">
        <Row>
          <Col md={12}>
            <SportForm sport={sport} error={error} onSubmit={this.onSubmit.bind(this)}/>
          </Col>
        </Row>
      </div>

    )
  }
}

NewSportPage.propTypes = {
  currentlySending: PropTypes.bool,

  loggedIn: PropTypes.bool
};

const mapStateToProps = state => {
  return({
    error: state.entities.error,
    currentlySending: state.entities.currentlySending,
    loggedIn: state.auth.loggedIn
  })
}

export default connect(mapStateToProps)(NewSportPage)
