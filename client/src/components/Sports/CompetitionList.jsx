import React from 'react';

import CompetitionCard from './CompetitionCard';
import CompetitionForm from './CompetitionForm';
import { Col, Row, Grid, Button, Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FiRefreshCw, FiPlusCircle } from 'react-icons/fi';
import Card from 'components/Card/Card.jsx';

class CompetitionList extends React.Component {

  constructor() {
    super();
    this.state = {
      currentCompetition:  {},
      showCompForm:  false
    };

    this.onNew = this.onNew.bind(this);
    this.onItemPress = this.onItemPress.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  onItemPress(comp) {
    this.setState({
      currentCompetition: comp,
      showCompForm: true
    });
  }
  handleDelete(comp) {
    if (window.confirm(`Sicuro di cancellare ${comp.name}? Tutti gli eventi ad essa collegati non saranno più raggiungibili`)) {
      this.props.onDelete(comp);
    }
  }
  onRefresh(e) {
    e.preventDefault();
    this.props.onRefresh();
  }
  onNew() {

    this.setState({
      showCompForm: true,
      currentCompetition: {}
    });
  }
  render() {
    const props = this.props;

    let { competitions, currentlySending, onNew } = props;
    let noCompLabel = null;
    if (!competitions || competitions.length <= 0) {
      noCompLabel = currentlySending ? "..." : "Non ci sono competizioni per questo sport";
      competitions = [];
    }


    const competitionList = competitions.map((comp) =>
      (<Col md={4}><li>
        <CompetitionCard
          key={comp._id} {...comp}
          onPress={() => this.onItemPress(comp)}
          onDelete={() => this.handleDelete(comp)}/>
      </li></Col>
      )
    );
    const currentCompetition = this.state.currentCompetition;
    return (
      <div className="competitions-list">

          <Row>
            <Col md={10}>
              <h4>
                Competizioni
                <a style={{verticalAlign:'middle', marginLeft: '8px'}}
                   className="action" onClick={this.onNew}
                  title="Aggiungi nuova competizione"
                   >
                  <FiPlusCircle/>
                </a>
                <a style={{verticalAlign:'middle', marginLeft: '8px'}}
                   className="action" onClick={this.onRefresh.bind(this)}
                   title="Aggiorna lista">
                  <FiRefreshCw className={currentlySending ? "fa-spin" : ""}/>
                </a>

              </h4>
              {noCompLabel && <p>Non ci sono competizioni</p>}
            </Col>
            <Col md={2}>

            </Col>
          </Row>
          <ul style={{listStyle: 'none', paddingLeft: 0}}>
            <Row>  {competitionList} </Row>
          </ul>

          <Modal keyboard={true} show={this.state.showCompForm}
             onHide={() => this.setState({showCompForm:false})}>
            <Modal.Header closeButton>
              <Modal.Title>
                {currentCompetition._id  ? "Aggiorna competizione" : "Crea nuova competizione"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CompetitionForm {...currentCompetition} onSubmit={props.onNew}/>
            </Modal.Body>

          </Modal>

      </div>
    );

  }
}

CompetitionList.propTypes = {
    competitions: PropTypes.array.isRequired,
    onItemPress: PropTypes.func,
    onRefresh: PropTypes.func,
    currentlySending: PropTypes.bool,
    onNew: PropTypes.func,
    onDelete: PropTypes.func
};


export default CompetitionList;
