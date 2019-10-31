import React from 'react';
import {
  Row, Col, Card, CardBody, FormGroup, Form, Button, Input, Label, InputGroup, InputGroupAddon
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';

import auth from '../../blockchain/auth';

class Login extends React.Component {
  state = {
    username: '',
    privKey: '',
    loginPrivKey: '',
    updating: false
  }

  componentDidMount() {
    if (auth.isLoggedIn()) this.props.history.push('/lobby');
  }

  register = async e => {
    e.preventDefault();
    if (!this.state.username) return;
    this.setState({ updating: true });
    const user = await auth.register(this.state.username);

    if (isEmpty(user)) alert("Operation failed! Please try again.");

    this.setState({
      privKey: user.privKey,
      updating: false
    });
  }

  login = async e => {
    e.preventDefault();
    if (!this.state.loginPrivKey) return;
    this.setState({ updating: true });
    const user = await auth.login(this.state.loginPrivKey);

    if (isEmpty(user)) {
      alert("Unable to login! Invalid privKey or user does not exist.");
      this.setState({ updating: false });
    }
    else {
      this.props.history.push('/lobby');
    }
  }

  onFieldChanged = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { privKey, username, updating, loginPrivKey } = this.state;

    return (
      <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Col className="m-auto" style={{ paddingBottom: '20vh' }} sm="10" md="6" lg="5" xl="4">
          {
            !privKey ? (
              <>
                <h1 className="mb-3">Welcome!</h1>
                <Form onSubmit={this.login} className="row">
                  <FormGroup className="col mb-0 flex-grow-1">
                    <InputGroup>
                      <Input type="password" name="loginPrivKey" required placeholder="Private Key..." value={loginPrivKey} onChange={this.onFieldChanged} />
                      <InputGroupAddon addonType="append">
                        <Button style={{ minWidth: '7em' }} className="btn-block" color="primary" type="submit" disabled={updating}>Login</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Form>
                <div className="text-center my-3">-- or --</div>
                <Form onSubmit={this.register} className="row">
                  <FormGroup className="col mb-0 flex-grow-1">
                    <InputGroup>
                      <Input type="text" readOnly={privKey} required name="username" placeholder="Username..." value={username} onChange={this.onFieldChanged} />
                      <InputGroupAddon addonType="append">
                        <Button style={{ minWidth: '7em' }} className="btn-block" color="primary" type="submit" disabled={updating}>Register</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Form>
              </>)
              : (
                <>
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label>Username:</Label>
                        <Input type="text" readOnly name="username" placeholder="Username..." value={username} />
                      </FormGroup>
                      {
                        privKey && (<>
                          <FormGroup>
                            <Label>Private Key (Save this to login):</Label>
                            <Input type="textarea" name="privKey" row="3" value={privKey} readOnly />
                          </FormGroup>
                        </>)
                      }
                    </CardBody>
                  </Card>
                  <div className="d-flex justify-content-center mt-3">
                    <Button color="primary" tag={Link} to="/lobby">Let's Play!</Button>
                  </div>
                </>
              )
          }
        </Col>
      </Row>
    );
  }
}

export default withRouter(Login);