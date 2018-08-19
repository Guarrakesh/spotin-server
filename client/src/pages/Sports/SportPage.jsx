import React from 'react';
import { connect } from 'react-redux';
import { saveSportRequest, getAllSports } from 'actions/sports';

import PropTypes from 'prop-types';
import {Row, Col} from 'react-bootstrap';
import SportForm from 'components/Sports/SportForm.jsx';

import { selectById } from 'selectors/sports.js';
class SportPage extends React.Component {

  onSubmit(sport) {
    this.props.dispatch(saveSportRequest(sport, false));
  }
  componentDidMount() {
    this.props.dispatch(getAllSports());
  }
  render() {


    const { sport, error } =  this.props;

    return (
      <div className="main-content">
        <Row>
          <Col md={12}>
            <SportForm {...sport} error={error}
               onSubmit={this.onSubmit.bind(this)}/>
          </Col>
        </Row>
      </div>

    )
  }
}

SportPage.propTypes = {
  currentlySending: PropTypes.bool,
  sport: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool
};

const mapStateToProps = (state, props) => {
  //Seleziono lo sport corrente dallo stato
  const sport = selectById(state, props.match.params.id);
  return({
    currentlySending: state.entities.currentlySending,
    error: state.entities.error,
    sport,
    loggedIn: state.auth.loggedIn
  })
}

export default connect(mapStateToProps)(SportPage)
