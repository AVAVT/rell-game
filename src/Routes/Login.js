import React from 'react';
import { Row, Col, Card, CardBody, FormGroup, Form, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';

import auth from '../blockchain/auth';

export default class Login extends React.Component {
  state = {
    username: '',
    privKey: '',
    updating: false
  }

  register = async e => {
    e.preventDefault();
    if (!this.state.username) return;
    this.setState({ updating: true });
    const user = await auth.register(this.state.username);

    if (isEmpty(user)) alert("Operation failed!");

    this.setState({
      privKey: user.privKey,
      updating: false
    });
  }

  onFieldChanged = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { privKey, username, updating } = this.state;

    return (
      <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Col className="m-auto" style={{ paddingBottom: '20vh' }} sm="10" md="8" xl="4">
          <Card>
            <CardBody>
              <Form onSubmit={this.register}>
                <FormGroup>
                  <Input type="text" readOnly={privKey} name="username" placeholder="Username" value={username} onChange={this.onFieldChanged} />
                </FormGroup>
                {
                  privKey && (<>
                    <p>I will think about mnemonic when this game become the next Minecraft. Here's your private key:</p>
                    <FormGroup>
                      <Input type="text" name="username" placeholder="Username" value={privKey} readOnly />
                    </FormGroup>
                  </>)
                }
                <div className="d-flex justify-content-end">
                  {
                    privKey
                      ? <Button color="primary" tag={Link} to="/lobby">Let's Play!</Button>
                      : <Button color="primary" type="submit" disabled={updating}>Register</Button>
                  }
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}