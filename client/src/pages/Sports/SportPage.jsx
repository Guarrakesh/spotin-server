import React from 'react';
import { connect } from 'react-redux';
import { saveSportRequest, getAllSports, deleteSportRequest } from 'actions/sports';

import PropTypes from 'prop-types';
import Button from 'elements/CustomButton/CustomButton.jsx';
import {Row, Col} from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import SportForm from 'components/Sports/SportForm.jsx';

import { selectById } from 'selectors/sports.js';
class SportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      show: false
    };


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
  }
  onDelete(sport) {
    this.showDeleteWarning(() => {
        this.props.dispatch(deleteSportRequest(sport));
        this.successDelete();
    });


  }
  render() {


    const { sport, error } =  this.props;

    return (
      <div className="main-content">
        {this.state.alert}
        <Row>
          <Col md={12}>
            <Button onClick={() => this.onDelete(sport)}>Elimina</Button>
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
