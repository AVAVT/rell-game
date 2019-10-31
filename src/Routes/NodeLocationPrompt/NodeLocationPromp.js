import React from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';

import blockchain from '../../blockchain/blockchain';
import auth from '../../blockchain/auth';
import { setNodeLocation } from '../../Redux/config/config';
import { connect } from 'react-redux';

class NodeLocationPrompt extends React.Component {
  state = {
    location: '',
    loading: false,
    success: true,
  }

  componentDidMount() {
    const cachedLocation = window.localStorage.getItem('nodeLocation', '');
    if (cachedLocation) {
      this.setState({ location: cachedLocation }, this.initializeNodeLocation);
    }
  }

  async initializeNodeLocation() {
    this.setState({ loading: true, success: true });
    const result = await blockchain.init(this.state.location);
    if (result === "pong") {
      if (process.env.NODE_ENV === 'production') await auth.loginFromSession();
      this.props.setNodeLocation(this.state.location);
    }
    else {
      this.setState({ loading: false, success: false });
    }
  }

  registerLocation = e => {
    e.preventDefault();
    if (!this.state.location) return;
    this.initializeNodeLocation();
  }

  onFieldChanged = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { location } = this.state;

    return (
      <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Col className="m-auto" style={{ paddingBottom: '20vh' }} sm="10" md="6" lg="5" xl="4">
          <Card>
            <CardBody>
              {
                this.state.loading ? (
                  <div>Testing connection, please wait...</div>
                ) : (
                    <Form onSubmit={this.registerLocation}>
                      <FormGroup>
                        {!this.state.success && <div className="color-danger">Cannot connect to server!</div>}
                        <Label>Please enter node location:</Label>
                        <Input type="text" name="location" placeholder="https://try.chromia.dev/node/#####/" value={location} onChange={this.onFieldChanged} />
                      </FormGroup>
                      <div className="d-flex justify-content-end">
                        <Button color="primary" type="submit">Connect</Button>
                      </div>
                    </Form>
                  )
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = {
  setNodeLocation
}

export default connect(null, mapDispatchToProps)(NodeLocationPrompt);