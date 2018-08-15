import React from 'react';

import SportCard from './SportCard';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button  from 'elements/CustomButton/CustomButton.jsx';
import { Grid, Row, Col, Glyphicon} from 'react-bootstrap';
const SportList = (props) => {

  if (props.sports.length <= 0) {
    return null;
  }

  const content = props.sports.map((sport) => (
    <Col md={2} sm={6}>
      <SportCard {...sport} onPress={() => props.onItemPress(sport)} />
    </Col>
  ));


  return <Grid fluid>
    <Row>
      <Col md={12}>
        <Link to="/sports/create">
          <Button fill className="pull-right" ><Glyphicon glyph="plus"/> Aggiungi nuovo</Button>
        </Link>
      </Col>
    </Row>
    <Row>
      {content}
    </Row>
  </Grid>


};

SportList.propTypes = {
  onItemPress: PropTypes.func.isRequired,
  sports: PropTypes.array.isRequired
};


export default SportList;
