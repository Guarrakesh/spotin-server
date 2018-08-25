import React from 'react';
import { connect } from 'react-redux';
import { saveSportRequest,
    getAllSports,
    getSportCompetitionsRequest,
    deleteSportRequest } from 'actions/sports';

import PropTypes from 'prop-types';
import Button from 'elements/CustomButton/CustomButton.jsx';
import {Row, Col, PanelGroup, Panel } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import SportForm from 'components/Sports/SportForm.jsx';
import CompetitionList from 'components/Sports/CompetitionList.jsx';

import { selectById } from 'selectors/sports.js';
class SportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      show: false
    };

    this.handleRefreshCompetitions = this.handleRefreshCompetitions.bind(this);
    this.handleNewCompetition = this.handleNewCompetition.bind(this);
    this.successDelete = this.successDelete.bind(this);
    this.showDeleteWarning = this.showDeleteWarning.bind(this);
  }


  successDelete() {
    this.setState({alert: (
      <SweetAlert warning
        success
        style={{display: "block",marginTop: "-150px"}}
        title="Deleted!"
        onConfirm={() => this.setState({alert:null})}
        onCancel={() => this.setState({alert:null})}
        confirmBtnBsStyle="info"
        >Lo sport è stato cancellato.</SweetAlert>
      )
    });
  }
  showDeleteWarning(callback) {
    this.setState({alert: (
      <SweetAlert warning
        style={{display: "block", marginTop: "-150px"}}
        title="Eliminare questo sport?"
        onConfirm={callback}
        onCancel={() => this.setState({alert: null})}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Sì, elimina"
        cancelBtnText="Annulla"
        showCancel
        >L'operazione è irreversibile!</SweetAlert>
      )
    });
  }

  onSubmit(sport) {
    this.props.dispatch(saveSportRequest(sport, false));
  }
  componentDidMount() {
    this.props.dispatch(getAllSports());
    if (this.props.sport && !this.props.currentlySending) {
      this.props.dispatch(getSportCompetitionsRequest(this.props.sport));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { sport, currentlySending } = this.props;
    //controllo currentlySending sia nello stato precedente che in quello corrente, per evitare un loop di richiesta
    if (sport && !sport.competitions && !prevProps.currentlySending && !currentlySending) {
      this.props.dispatch(getSportCompetitionsRequest(this.props.sport));
    }
  }
  onDelete(sport) {
    this.showDeleteWarning(() => {
        this.props.dispatch(deleteSportRequest(sport));
        this.successDelete();
    });


  }
  handleNewCompetition() {

  }
  handleRefreshCompetitions() {
    this.props.dispatch(getSportCompetitionsRequest(this.props.sport));
  }
  render() {


    const { sport, error, currentlySending } =  this.props;
    if (!sport) return null;
    return (
      <div className="main-content">
        {this.state.alert}
        <Row>
          <Col md={10}><h2 style={{marginTop:0}}>{sport.name}</h2></Col>
          <Col md={2}>
            <Button className="pull-right" fill onClick={() => this.onDelete(sport)} bsStyle="danger">Elimina</Button>

          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <SportForm {...sport} error={error}
               onSubmit={this.onSubmit.bind(this)}/>
          </Col>
        </Row>

            <CompetitionList onRefresh={this.handleRefreshCompetitions} currentlySending={currentlySending}
              competitions={sport.competitions}
              onNew={this.handleNewCompetition} />

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
