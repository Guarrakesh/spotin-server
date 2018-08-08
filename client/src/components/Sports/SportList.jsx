import React from 'react';

import SportCard from './SportCard';
import PropTypes from 'prop-types';

import Button  from 'elements/CustomButton/CustomButton.jsx';
import { Grid, Row, Col, Glyphicon} from 'react-bootstrap';
const SportList = (props) => {

  if (props.sports.length <= 0) {
    return null;
  }

  const content = props.sports.map((sport) => (
    <Col md={2} sm={6}>
      <SportCard {...sport}/>
    </Col>
  ));


  return <Grid fluid>
    <Row>
      <Col md={12}>
        <Button fill className="pull-right" bsSize="large" ><Glyphicon glyph="plus"/> Aggiungi nuovo</Button>
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
