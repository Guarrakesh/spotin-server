import React from 'react';
import { connect } from 'react-redux';
import { saveSportRequest } from 'actions/sports';

import PropTypes from 'prop-types';
import {Row, Col} from 'react-bootstrap';
import SportForm from 'components/Sports/SportForm.jsx';
class NewSportPage extends React.Component {

  onSubmit(sport) {
    this.props.dispatch(saveSportRequest(this.state, true));
  }

  render() {


    const { sport } =  this.props.location.state;
    return (
      <div className="main-content">
        <Row>
          <Col md={12}>
            <SportForm {...sport} onSubmit={this.onSubmit.bind(this)}/>
          </Col>
        </Row>
      </div>

    )
  }
}

NewSportPage.propTypes = {
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

export default connect(mapStateToProps)(NewSportPage)
