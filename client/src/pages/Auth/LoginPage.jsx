import React, { Component } from 'react';
import {
  Grid, Row, Col,
  FormGroup, ControlLabel, FormControl, HelpBlock
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Card from 'components/Card/Card.jsx';

import Button from 'elements/CustomButton/CustomButton.jsx';
import Checkbox from 'elements/CustomCheckbox/CustomCheckbox.jsx';

import { connect } from 'react-redux';
import { loginRequest } from '../../actions/login';

class LoginPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      cardHidden: true,
      email: null,
      password: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount(){
    setTimeout(function() { this.setState({cardHidden: false}); }.bind(this), 700);

  }

  handleSubmit() {
    this.props.dispatch(loginRequest(this.state.email, this.state.password));

  }
  render(){
    if (this.props.auth.loggedIn) {
      return (<Redirect to="/dashboard"/>)
    }
    const { currentlySending, error } = this.props.auth;
    return (
      <Grid>
        <Row>
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>

            <form>
              <Card
                hidden={this.state.cardHidden}
                textCenter
                title="Accedi al pannello"
                content={
                  <div>
                    <FormGroup validationState={error && error.message ? "error" : null}>
                      <ControlLabel>
                        Indirizzo Email
                      </ControlLabel>
                      <FormControl

                        placeholder="Inserisci email"
                        type="email"
                        onChange={(e) => this.setState({email: e.target.value})}
                      />
                      <HelpBlock>{error && error.message ? error.message : null}</HelpBlock>

                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Password
                      </ControlLabel>
                      <FormControl
                        placeholder="Password"
                        type="password"
                        onChange={(e) => this.setState({password: e.target.value})}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Checkbox
                        number="1"
                        label="Ricorda l'accesso"
                      />
                    </FormGroup>
                  </div>
                }
                legend={
                  <Button onClick={this.handleSubmit} round bsStyle="info" fill wd
                  disabled={(!this.state.email || !this.state.password)}>
                    {currentlySending ? "Carico..." : "Login"}
                  </Button>
                }
                ftTextCenter
              />
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}
export default connect(mapStateToProps)(LoginPage);
