import React from 'react';
import { Row, Col, Form, Input, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import debounce from 'debounce';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

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
  readyForNextRound,
  reset,
  PENDING_TYPES
} from '../../Redux/game/game';
import auth from '../../blockchain/auth';
import BetSlider from './Components/BetSlider';
import RuleModal from './Components/RuleModal';
import GameCard from './Components/GameCard';
import { cardNames } from '../../blockchain/game-logic';

class Game extends React.Component {
  state = {
    message: '',
    showingRules: false
  }

  componentDidMount() {
    this.props.reset();
    const gameId = Number(this.props.match.params.gameId);
    this.getGameStatus = debounce(() => this.props.getGameStatus(gameId), 500);
    this.getGameStatus();
    this.preloadImages();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loadingGameStatus && !this.props.loadingGameStatus) {
      this.getGameStatus();

      if (prevProps.messages.length < this.props.messages.length) this.refs.messages.scrollTop = this.refs.messages.scrollHeight

      if (isEmpty(prevProps.game) && !isEmpty(this.props.game)) {
        if (isPlayer1(this.props.game) || isPlayer2(this.props.game)) this.props.getCardFragments(this.props.game.id);
      }
    }

    if (prevProps.pendingMessages.length < this.props.pendingMessages.length) {
      setTimeout(() => this.refs.messages.scrollTop = this.refs.messages.scrollHeight, 0);
    }

    if (prevProps.loadingCardFragments && !this.props.loadingCardFragments) {
      if (isEmpty(this.props.cardCodewords)) this.props.getCardFragments(this.props.game.id);
    }
  }

  preloadImages = () => {
    cardNames.forEach((picture) => {
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/images/cards/${picture}.svg`;
    });
  }

  toggleRules = () => this.setState({ showingRules: !this.state.showingRules });

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
  readyForNextRound = () => this.props.readyForNextRound(Number(this.props.match.params.gameId));

  renderBettingPanel = (playerMoney, playerBet) => {
    const { pendingActions } = this.props;
    const buttonDisabled = pendingActions[PENDING_TYPES.PLACE_BET] || !!playerBet;

    return <BetSlider onSubmit={this.placeBet} disabled={buttonDisabled} maxValue={Math.min(50, playerMoney)} />
  }

  renderGameView = (currentUser) => {
    const { cardsInPlayerHand, playerBets, playerMonies, game, gameState, handsValue, isReadyForNextRound, sending } = this.props;
    return (
      <div className="d-flex flex-column" style={{ height: '100%' }}>
        <div id="dealer-zone" className="flex-grow-1 d-flex flex-column">
          <div className="text-center pb-3">Deck: {52 - gameState.top_card_index} cards left</div>
          <div className="d-flex flex-grow-1 flex-row-reverse justify-content-center align-items-start position-relative">
            {
              gameState.phrase === 0
                ? <h3 className="d-flex align-items-center" style={{ height: '100%' }}><div className="text-center">Round {gameState.round}<br />Place your bet</div></h3>
                : cardsInPlayerHand[0].map((card, index) => (
                  <GameCard
                    key={card.card_index}
                    cardName={card.revealValue || 'back'}
                    top={index * 30}
                    orinTop={-200}
                    orinLeft={0}
                    style={{ marginRight: `${index === 0 ? 0 : -80}px` }}
                  />
                ))
            }
            {gameState.phrase > 3 && <div className="text-dark" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 700, fontSize: '3rem', textShadow: '0 0 5px #ffffff' }}>{handsValue[0]}</div>}
          </div>
        </div>
        <div id="players-zone" className="d-flex flex-grow-1">
          {Array.from({ length: 2 }).map((_, index) => index + 1).map(playerIndex => {
            const playerHand = cardsInPlayerHand[playerIndex];
            const playerId = game[`player_${playerIndex}`];
            const playerName = game[`player_${playerIndex}_name`];
            const playerBet = (playerBets.find(player => player.id === playerId) || {}).amount;
            const playerMoney = (playerMonies.find(player => player.id === playerId) || {}).amount;
            const isCurrentPlayer = playerId === currentUser.id;
            const isActivePlayer = playerIndex === gameState.phrase;
            const playerHasUnknownCard = playerHand.some(card => card.revealValue === "")

            return (
              <div key={playerIndex} className="d-flex flex-column-reverse flex-grow-1 pb-5">
                <h4 className="text-center flex-0">
                  {`${playerName}${isCurrentPlayer ? ` (You)` : ''} - $${playerMoney}`}
                </h4>
                <div className="flex-0 d-flex justify-content-center align-items-center" style={{ height: '3.5em' }}>
                  {
                    (gameState.phrase === 0 && isCurrentPlayer && !playerBet)
                      ? this.renderBettingPanel(playerMoney, playerBet)
                      : playerBet
                        ? `Betting $${playerBet}`
                        : '...Thinking...'
                  }
                </div>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '4.5em' }}>
                  {
                    isActivePlayer && (
                      isCurrentPlayer
                        ? (!playerHasUnknownCard && (
                          <>
                            <Button color="primary mx-1" onClick={this.hit} disabled={sending}>Hit</Button>
                            <Button color="primary mx-1" onClick={this.stand} disabled={sending}>Stand</Button>
                          </>
                        ))
                        : '...Thinking...')
                  }
                  {gameState.phrase > 3 && (
                    isReadyForNextRound
                      ? 'Ready'
                      : (isCurrentPlayer && (
                        <Button className="mx-1" color="primary" onClick={this.readyForNextRound}>Next Round</Button>
                      ))
                  )}
                </div>
                <div className="d-flex justify-content-center align-items-end position-relative">
                  {
                    playerHand.map((card, index) => (
                      <GameCard
                        key={card.card_index}
                        cardName={card.revealValue || 'back'}
                        top={-index * 30}
                        orinTop={-window.innerHeight / 2 - 200}
                        orinLeft={playerIndex === 1 ? '50%' : '-50%'}
                        style={{ marginLeft: `${index === 0 ? 0 : -80}px` }}
                      />
                    ))
                  }
                  {gameState.phrase > 3 && <div className="text-dark" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 700, fontSize: '3rem', textShadow: '0 0 5px #ffffff' }}>{handsValue[playerIndex]}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  renderLoader = (phrase, player_1_name, player_2_name) => (
    <div className="position-absolute d-flex flex-column justify-content-center align-items-center" style={{ top: 0, left: 0, bottom: 0, right: 0 }} >
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
      <h4 className="px-5">
        {
          phrase === -4 ? `${player_2_name} is shuffling the deck very carefully...`
            : phrase === -3 ? `${player_1_name} is shuffling the deck very carefully...`
              : phrase === -2 ? `Players are double-checking the deck...`
                : `Game starting soon...`
        }
      </h4>
    </div>
  )

  render() {
    const { messages, pendingMessages, game, gameState, resigning } = this.props;
    const messagesToShow = [...messages, ...pendingMessages];
    const currentUser = auth.getCurrentUser();

    return (
      <>
        <Row>
          <Col lg="9" className="py-3 position-relative" style={{ height: '100vh' }}>
            {!isEmpty(game) && (
              <>
                {gameState.phrase < 0 && this.renderLoader(gameState.phrase, game.player_1_name, game.player_2_name)}
                {gameState.phrase >= 0 && this.renderGameView(currentUser)}

                {game.finished !== -1 && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }} className="d-flex justify-content-center align-items-center">
                    <div>Game has ended. Winner: {game.winner === 1 ? game.player_1_name : game.player_2_name}!</div>
                  </div>
                )}

                <div className="position-absolute d-flex justify-content-between" style={{ left: 10, right: 10, top: 10 }}>
                  <Button color="outline-primary" onClick={this.toggleRules}>? Rules ?</Button>
                  {
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
                  }
                </div>
              </>
            )}
          </Col>
          <Col lg="3" className="d-flex flex-column justify-content-end py-3 col-lg-3" style={{ maxHeight: '100vh', background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex-grow-1 d-flex flex-column justify-content-end" style={{ overflow: 'hidden' }}>
              <div style={{ overflow: 'auto' }} ref="messages">
                {
                  messagesToShow.length > 0
                    ? messagesToShow.map((message, index) => (
                      <p
                        style={{
                          wordBreak: 'break-word'
                        }}
                        key={index}>
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
        <RuleModal isOpen={this.state.showingRules} onClose={this.toggleRules} />
      </>
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
  stand,
  readyForNextRound
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
    game: gameInfo,
    gameState,
    pendingActions,
    playerBets,
    playerMonies,
    cardsInPlayerHand,
    handsValue,
    isReadyForNextRound
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
    playerMonies,
    messages,
    pendingMessages,
    pendingActions,
    cardsInPlayerHand,
    handsValue,
    isReadyForNextRound
  }
}

export default withRouter(connect(mapAppStateToProps, mapDispatchToProps)(Game));