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
  }
  onRefresh(e) {
    e.preventDefault();
    this.props.onRefresh();
  }
  onNew() {
    this.setState({showCompForm: true});
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
        <CompetitionCard key={comp._id} {...comp}/>
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

          <Modal show={this.state.showCompForm}>
            <Modal.Body>
              <CompetitionForm {...currentCompetition}/>
            </Modal.Body>
          </Modal>

      </div>
    );

  }
}

CompetitionList.propTypes = {
    competitions: PropTypes.array.isRequired,
    onItemPress: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    currentlySending: PropTypes.bool,
    onNew: PropTypes.func.isRequired,
};


export default CompetitionList;
