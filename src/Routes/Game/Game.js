import React from 'react';
import { Row, Col, Form, Input, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import debounce from 'debounce';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { getGameStatus, postMessage } from '../../Redux/game/game';
import auth from '../../blockchain/auth';

class Game extends React.Component {
  state = {
    message: ''
  }

  componentDidMount() {
    const gameId = Number(this.props.match.params.gameId);
    this.getGameStatus = debounce(() => this.props.getGameStatus(gameId), 500);
    this.getGameStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loading && !this.props.loading) {
      this.getGameStatus();
      if (prevProps.messages.length === 0) this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    }
  }

  onMessageChanged = e => this.setState({
    message: e.target.value
  })

  postMessage = e => {
    e.preventDefault();
    this.props.postMessage(Number(this.props.match.params.gameId), this.state.message);
    this.setState({ message: '' });
  }

  leaveGame = () => this.props.history.push('/lobby')

  render() {
    const { messages, fulfilledMessages, pendingMessages, game } = this.props;
    const messagesToShow = [...messages, ...fulfilledMessages, ...pendingMessages];
    const currentUser = auth.getCurrentUser();

    return (
      <Row style={{ height: '100vh' }}>
        <Col lg="9" className="py-3">

        </Col>
        <Col lg="3" className="d-flex flex-column justify-content-end py-3 col-lg-3" style={{ maxHeight: '100%', background: 'rgba(0,0,0,0.2)' }}>
          <div className="flex-grow-0 d-flex justify-content-between mb-3">
            {
              !isEmpty(game) && (
                game.player_1 !== currentUser.id && game.player_2 !== currentUser.id
                  ? (
                    <Button color="outline-danger" onClick={this.leaveGame}>
                      Leave Game
                  </Button>
                  )
                  : (
                    <Button color="outline-danger">
                      Resign
                  </Button>
                  )
              )
            }

          </div>
          <div className="flex-grow-1 d-flex flex-column justify-content-end" style={{ overflow: 'hidden' }}>
            <div style={{ overflow: 'auto' }} ref="messages">
              {
                messagesToShow.length > 0
                  ? messagesToShow.map(message => (
                    <p
                      style={{
                        wordBreak: 'break-word'
                      }}
                      key={message.timestamp}>
                      <b className={message.author_name === currentUser.username ? 'text-primary' : 'text-secondary'}>[{moment(message.timestamp).fromNow()}] {message.author_name}</b>:<br />{message.message}
                    </p>
                  ))
                  : <div className="text-muted">Say something nice e.g. "Good game, have fun!"</div>
              }
            </div>
          </div>
          <Form className="flex-grow-0 mt-3" onSubmit={this.postMessage}>
            <Input type="text" autoComplete="message" value={this.state.message} onChange={this.onMessageChanged} />
          </Form>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = { getGameStatus, postMessage };
const mapAppStateToProps = ({ game }) => {
  const { loading, messages, pendingMessages, fulfilledMessages, game: gameInfo } = game;
  return {
    loading,
    game: gameInfo,
    messages,
    fulfilledMessages,
    pendingMessages
  }
}

export default withRouter(connect(mapAppStateToProps, mapDispatchToProps)(Game));