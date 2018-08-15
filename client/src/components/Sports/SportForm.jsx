import React, { Component } from 'react';
import {
  Grid, Row, Col,
  FormGroup, ControlLabel, FormControl, HelpBlock, Form, InputGroup,
} from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';


import Card from 'components/Card/Card.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';

class SportForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name || "",
      slug: props.slug || "",
      active: props.active || ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(e) {
    if (e.target) {
      this.setState({[e.target.name] : e.target.value});
    } else if (e.state) {
      this.setState({active: e.state.value});
    }

  }
  handleSubmit() {
    const { name, slug, active } = this.state;
    if (!name || !slug || active === undefined)
      return;

    this.props.onSubmit(this.state);
  }
  componentWillReceiveProps() {
    this.state = {
      name: this.props.name,
      slug: this.props.slug,
      active: this.props.active
    }
  }
  render() {
    const { name, slug, active } = this.state;

    return (
      <Card
        content={
          <div>
            <form>
            <Row>
              <Col md={5}>
                <FormGroup>
                  <ControlLabel> Nome </ControlLabel>
                  <FormControl value={name} placeholder="nome" type="textCenter" name="name"  onChange={this.handleInputChange}/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <ControlLabel>Slug</ControlLabel>
                  <FormControl value={slug} placeholder="slug" type="text" name="slug"  onChange={this.handleInputChange}/>
                </FormGroup>
              </Col>
              <Col md={2}>
                <p>Attivo</p>
                <Switch defaultValue={true} value={active} onChange={this.handleInputChange}/>
              </Col>
              <Col md={12}>
                <Button onClick={this.handleSubmit}
                  bsStyle="primary" fill wd className="pull-right">Salva</Button>
              </Col>
            </Row>
            </form>
          </div>
        } />
    )
  }
}

export default SportForm;
