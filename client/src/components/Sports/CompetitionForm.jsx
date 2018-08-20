import React, { Component } from 'react';
import {
  Grid, Row, Col,
  FormGroup, ControlLabel, FormControl, HelpBlock, Form, InputGroup,
} from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';


import Card from 'components/Card/Card.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';

class CompetitionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name || "",
      country: props.country || "",
      competitorsHaveLogo: props.competitorsHaveLogo || true
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(e) {
    if (e.target) {
      this.setState({[e.target.name] : e.target.value});
    } else if (e.state) {
      this.setState({competitorsHaveLogo: e.state.value});
    }

  }
  handleSubmit() {
    const { name, country, competitorsHaveLogo } = this.state;
    if (!name || country === undefined)
      return;

    this.props.onSubmit(this.state);
  }
  componentWillReceiveProps() {
    this.state = {
      name: this.props.name || "",
      country: this.props.country || "",
      competitorsHaveLogo: this.props.competitorsHaveLogo || true,
      _id: this.props._id || null
    }
  }
  render() {

    const { name, country, competitorsHaveLogo, _id} = this.state;


    return (

          <div>
            <form>
            <Row>

              <Col md={12}>
                <FormGroup >
                  <ControlLabel> Nome </ControlLabel>
                  <FormControl value={name} placeholder="nome" type="textCenter" name="name"  onChange={this.handleInputChange}/>

                  </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <ControlLabel>Nazione</ControlLabel>
                  <FormControl value={country} placeholder="nazione" type="text" name="country"  onChange={this.handleInputChange}/>

                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <p>Mostra i loghi dei competitor</p>
                <Switch defaultValue={true} value={competitorsHaveLogo} onChange={this.handleInputChange}/>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Button onClick={this.handleSubmit}
                  bsStyle="primary" fill wd className="pull-right">Salva</Button>
              </Col>
            </Row>
            </form>
          </div>

    )
  }
}

export default CompetitionForm;
