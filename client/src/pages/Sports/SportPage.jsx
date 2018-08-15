import React from 'react';
import { connect } from 'react-redux';
import { saveSportRequest } from 'actions/sports';

import PropTypes from 'prop-types';
import {Row, Col} from 'react-bootstrap';
import SportForm from 'components/Sports/SportForm.jsx';
class SportPage extends React.Component {

  onSubmit(sport) {
    this.props.dispatch(saveSportRequest(sport, false));
  }
  componentDidMount() {

  }
  render() {


    const { sport } =  this.props;
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

SportPage.propTypes = {
  currentlySending: PropTypes.bool,
  sports: PropTypes.array.isRequired,
  loggedIn: PropTypes.bool
};

const mapStateToProps = (state, props) => {
  //Seleziono lo sport corrente dallo stato
  const sport = state.entities.sports.find(item => item._id == props.match.params.id);
  return({
    currentlySending: state.entities.currentlySending,
    sport,
    loggedIn: state.auth.loggedIn
  })
}

export default connect(mapStateToProps)(SportPage)