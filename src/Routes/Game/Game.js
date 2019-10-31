import React from 'react';
import { Row, Col, Form, Input, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import debounce from 'debounce';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import './Game.scss';

import {
  isPlayer1,
  isPlayer2,
  getGameStatus,
  postMessage,
  resign,
  placeBet,
  getCardFragments,
  hit,
  stand,
  reset,
  PENDING_TYPES
} from '../../Redux/game/game';
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
        if (isPlayer1(this.props.game) || isPlayer2(this.props.game)) this.props.getCardFragments(this.props.game.id);
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

  hit = () => this.props.hit(Number(this.props.match.params.gameId));
  stand = () => this.props.stand(Number(this.props.match.params.gameId));

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
              playerHand.map(card => <img key={card.card_index} width="100" alt={card.revealValue || 'back'} src={`/images/cards/${card.revealValue || 'back'}.svg`} />)
            }
          </div>)
          if (playerIndex > 0) {
            const playerId = game[`player_${playerIndex}`];
            const playerBet = playerBets.find(player => player.id === playerId).amount;
            return (
              <div className="mb-3" key={playerIndex}>
                <div>${playerBet}</div>
                {hand}
              </div>

            )
          }
          else return (
            <div className="mb-3" key={playerIndex}>
              {hand}
            </div>
          )
        })
      }
    </div>)
  }

  renderGameView = (currentUser) => {
    const { cardsInPlayerHand, playerBets, game, gameState } = this.props;
    return (
      <div className="d-flex flex-column" style={{ height: '100%' }}>
        <div id="dealer-zone" className="flex-grow-1 d-flex flex-row-reverse justify-content-center align-items-start pt-5">
          {
            gameState.phrase === 0
              ? <h3 className="d-flex align-items-center" style={{ height: '100%' }}><span>Place your bet</span></h3>
              : cardsInPlayerHand[0].map((card, index) => <img key={card.card_index} className="game-card" style={{ top: `${index * 30}px`, marginRight: `${index === 0 ? 0 : -80}px` }} width="100" alt={card.revealValue || 'back'} src={`/images/cards/${card.revealValue || 'back'}.svg`} />)
          }
        </div>
        <div id="players-zone" className="d-flex flex-grow-1">
          {Array.from({ length: 2 }).map((_, index) => index + 1).map(playerIndex => {
            const playerHand = cardsInPlayerHand[playerIndex];
            const playerId = game[`player_${playerIndex}`];
            const playerName = game[`player_${playerIndex}_name`];
            const playerBet = (playerBets.find(player => player.id === playerId) || {}).amount;
            const isCurrentPlayer = playerId === currentUser.id;
            const currentPlayerIsActivePlayer = playerIndex === gameState.phrase;

            return (
              <div key={playerIndex} className="d-flex flex-column-reverse flex-grow-1 pb-5">
                <h4 className="text-center flex-0">
                  {`${playerName}${isCurrentPlayer ? ` (You)` : ''}`}
                </h4>
                <div className="flex-0 d-flex justify-content-center align-items-center" style={{ height: '3.5em' }}>
                  {
                    (gameState.phrase === 0 && isCurrentPlayer && !playerBet)
                      ? this.renderBettingPanel(currentUser)
                      : playerBet
                        ? `Betting $${playerBet}`
                        : ' '
                  }
                </div>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '4.5em' }}>
                  {
                    isCurrentPlayer && currentPlayerIsActivePlayer && (
                      <>
                        <Button color="success mx-1" onClick={this.hit}>Hit</Button>
                        <Button color="success mx-1" onClick={this.stand}>Stand</Button>
                      </>
                    )
                  }
                </div>
                <div className="d-flex justify-content-center align-items-end">
                  {
                    playerHand.map((card, index) => <img key={card.card_index} className="game-card" style={{ bottom: `${index * 30}px`, marginLeft: `${index === 0 ? 0 : -80}px` }} width="100" alt={card.revealValue || 'back'} src={`/images/cards/${card.revealValue || 'back'}.svg`} />)
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  render() {
    const { messages, fulfilledMessages, pendingMessages, game, gameState, resigning } = this.props;
    const messagesToShow = [...messages, ...fulfilledMessages, ...pendingMessages];
    const currentUser = auth.getCurrentUser();

    return (
      <Row>
        <Col lg="9" className="py-3" style={{ height: '100vh' }}>
          {!isEmpty(game) && game.finished !== -1
            ? (
              <div style={{ height: '100%' }} className="d-flex justify-content-center align-items-center">
                <div>Game has ended. Winner: {game.winner === 1 ? game.player_1_name : game.player_2_name}!</div>
              </div>
            ) : (gameState.phrase >= 0 && this.renderGameView(currentUser))}
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
                  ) : (
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

const mapDispatchToProps = {
  getGameStatus,
  postMessage,
  resign,
  reset,
  placeBet,
  getCardFragments,
  hit,
  stand
};
const mapAppStateToProps = ({ game }) => {
  const {
    sending,
    loadingGameStatus,
    loadingCardFragments,
    cardCodewords,
    resigning,
    messages,
    pendingMessages,
    fulfilledMessages,
    game: gameInfo,
    gameState,
    pendingActions,
    playerBets,
    cardsInPlayerHand
  } = game;
  return {
    sending,
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