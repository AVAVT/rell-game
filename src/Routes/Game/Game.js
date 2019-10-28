import React from 'react';
import { Row, Col, Form, Input, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import debounce from 'debounce';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { getGameStatus, postMessage, resign, placeBet, getCardFragments, reset, PENDING_TYPES } from '../../Redux/game/game';
import auth from '../../blockchain/auth';

class Game extends React.Component {
  state = {
    message: ''
  }

  componentDidMount() {
    this.props.reset();
    const gameId = Number(this.props.match.params.gameId);
    this.getGameStatus = debounce(() => this.props.getGameStatus(gameId), 500);
    this.getGameStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loadingGameStatus && !this.props.loadingGameStatus) {
      this.getGameStatus();

      if (prevProps.messages.length === 0) this.refs.messages.scrollTop = this.refs.messages.scrollHeight;

      if (isEmpty(prevProps.game) && !isEmpty(this.props.game)) {
        const { player_1, player_2 } = this.props.game;
        const currentUser = auth.getCurrentUser();
        if (currentUser.id === player_1 || currentUser.id === player_2) this.props.getCardFragments(this.props.game.id);
      }
    }

    if (prevProps.loadingCardFragments && !this.props.loadingCardFragments) {
      if (isEmpty(this.props.cardCodewords)) this.props.getCardFragments(this.props.game.id);
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

  confirmResign = () => {
    if (window.confirm("Are you sure you want to resign?")) {
      this.props.resign(Number(this.props.match.params.gameId));
    }
  }

  placeBet = amount => this.props.placeBet(
    Number(this.props.match.params.gameId),
    this.props.gameState.round,
    amount
  );

  renderBettingPanel = (currentUser) => {
    const { playerBets, pendingActions } = this.props;
    const buttonDisabled = pendingActions[PENDING_TYPES.PLACE_BET] || playerBets.some(bet => bet.id === currentUser.id);
    return (
      <div className="text-center">
        {[5, 10, 20].map(amount => (
          <Button key={amount} className="mx-1" color="success" disabled={buttonDisabled} onClick={() => this.placeBet(amount)}>${amount}</Button>
        ))}
      </div>
    )
  }

  renderPlayerHands = () => {
    const { cardsInPlayerHand, playerBets, game } = this.props;
    return (<div className="d-flex flex-column justify-content-start" style={{ height: '100%' }}>
      {
        cardsInPlayerHand.map((playerHand, playerIndex) => {
          const hand = (<div className="d-flex justify-content-start">
            {
              playerHand.map(card => <img width="100" alt={card.revealValue || 'back'} src={`/images/cards/${card.revealValue || 'back'}.svg`} />)
            }
          </div>)
          if (playerIndex > 0) {
            const playerId = game[`player_${playerIndex}`];
            const playerBet = playerBets.find(player => player.id === playerId).amount;
            return (
              <div className="mb-3">
                <div>${playerBet}</div>
                {hand}
              </div>

            )
          }
          else return (
            <div className="mb-3">
              {hand}
            </div>
          )
        })
      }
    </div>)
  }

  render() {
    const { messages, fulfilledMessages, pendingMessages, game, gameState, resigning } = this.props;
    const messagesToShow = [...messages, ...fulfilledMessages, ...pendingMessages];
    const currentUser = auth.getCurrentUser();

    return (
      <Row>
        <Col lg="9" className="py-3" style={{ height: '100vh' }}>
          {gameState.phrase === 0 && this.renderBettingPanel(currentUser)}
          {gameState.phrase > 0 && this.renderPlayerHands()}

          {!isEmpty(game) && game.finished !== -1 && (
            <div style={{ height: '100%' }} className="d-flex justify-content-center align-items-center">
              <div>Game has ended. Winner: {game.winner === 1 ? game.player_1_name : game.player_2_name}!</div>
            </div>
          )}
        </Col>
        <Col lg="3" className="d-flex flex-column justify-content-end py-3 col-lg-3" style={{ maxHeight: '100vh', background: 'rgba(0,0,0,0.2)' }}>
          <div className="flex-grow-0 d-flex justify-content-end mb-3">
            {
              !isEmpty(game) && (
                game.finished !== -1 || (game.player_1 !== currentUser.id && game.player_2 !== currentUser.id)
                  ? (
                    <Button color="outline-secondary" onClick={this.leaveGame}>
                      Leave Game
                  </Button>
                  )
                  : (
                    <Button color="outline-secondary" disabled={resigning} onClick={this.confirmResign}>
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
            <Input type="text" autoComplete="message" placeholder="Chat..." value={this.state.message} onChange={this.onMessageChanged} />
          </Form>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = { getGameStatus, postMessage, resign, reset, placeBet, getCardFragments };
const mapAppStateToProps = ({ game }) => {
  const { loadingGameStatus, loadingCardFragments, cardCodewords, resigning, messages, pendingMessages, fulfilledMessages, game: gameInfo, gameState, pendingActions, playerBets, cardsInPlayerHand } = game;
  return {
    resigning,
    loadingGameStatus,
    loadingCardFragments,
    cardCodewords,
    game: gameInfo,
    gameState,
    playerBets,
    messages,
    fulfilledMessages,
    pendingMessages,
    pendingActions,
    cardsInPlayerHand
  }
}

export default withRouter(connect(mapAppStateToProps, mapDispatchToProps)(Game));