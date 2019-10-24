import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Table, Row, Col, Card, CardBody, Progress } from 'reactstrap';

import { getLobbyStatus, lookForGame, stopLookingForGame, joinGame, reset } from '../../Redux/lobby/lobby';
import auth from '../../blockchain/auth';
import moment from 'moment';
import debounce from 'debounce';

class Lobby extends React.Component {
  state = {
    initialized: false
  }

  componentDidMount() {
    this.props.reset();
    this.getLobbyStatus = debounce(this.props.getLobbyStatus, 1000);
    this.getLobbyStatus();
  }

  componentWillUnmount() {
    if (this.props.isLookingForGame) this.props.stopLookingForGame();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loading && !this.props.loading) {
      if (!this.state.initialized) this.setState({ initialized: true });
      this.getLobbyStatus();
    }

    const { currentUser, gameList } = this.props;
    if (prevProps.gameList !== gameList) {
      const newGame = gameList.find(game => game.player_1 === currentUser.id || game.player_2 === currentUser.id);
      if (newGame) this.props.history.push(`/game/${newGame.id}`);
    }
  }

  logout = () => {
    auth.logout();
    this.props.history.push('/');
  }

  composeRedirectToGameHandler = gameId => () => this.props.history.push(`/game/${gameId}`);

  findGame = () => this.props.lookForGame();
  quitFindGame = () => this.props.stopLookingForGame();
  composeJoinHandler = userId => () => this.props.joinGame(userId);

  render() {
    const { waitList, gameList, currentUser, isLookingForGame, sending } = this.props;
    return (
      <>
        <div className="d-flex justify-content-end align-items-end py-4">
          <div className="d-flex align-items-baseline">
            <div>Welcome, {currentUser.username}!</div>
            <Button
              color="outline-danger"
              className="ml-3"
              onClick={this.logout}>
              Logout
            </Button>
          </div>
        </div>
        <Row>
          {
            !this.state.initialized
              ? <Col md={{ size: 4, offset: 4 }} className="pt-5"><Progress animated value={100} /></Col>
              : (
                <>
                  <Col lg="6" className="mb-3 mb-lg-0">
                    <Card style={{ height: '100%' }}>
                      <CardBody>
                        <div className="d-flex justify-content-between align-items-baseline">
                          <h4>Wait List</h4>
                          {
                            this.state.initialized && (
                              isLookingForGame ? (
                                <Button
                                  color="outline-danger"
                                  onClick={this.quitFindGame}
                                  disabled={sending}>
                                  Stop Finding
                      </Button>
                              ) : (
                                  <Button
                                    color="primary"
                                    onClick={this.findGame}
                                    disabled={sending}>
                                    Find Game
                          </Button>
                                )
                            )
                          }
                        </div>

                        <hr />
                        <Table responsive borderless striped hover>
                          <tbody>
                            {waitList.map(waiter => <tr key={waiter.id}>
                              <td>{moment(waiter.timestamp).fromNow()}</td>
                              <td valign="middle">{waiter.username}</td>
                              <td className="text-right">{waiter.id !== currentUser.id && <Button color="outline-primary" onClick={this.composeJoinHandler(waiter.id)}>Join</Button>} </td>
                            </tr>)}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="6">
                    <Card style={{ height: '100%' }}>
                      <CardBody>
                        <h4>Active Games</h4>
                        <hr />
                        <Table responsive borderless striped hover>
                          <tbody>
                            {gameList.map(game => <tr key={game.id}>
                              <td>{moment(game.timestamp).fromNow()}</td>
                              <td>{game.player_1_name}</td>
                              <td valign="middle">{game.player_2_name}</td>
                              <td className="text-right">
                                {
                                  game.player_1 !== currentUser.id && game.player_2 !== currentUser.id
                                    ? <Button color="outline-primary" onClick={this.composeRedirectToGameHandler(game.id)}>Spectate</Button>
                                    : <Button color="primary" onClick={this.composeRedirectToGameHandler(game.id)}>Play</Button>
                                } </td>
                            </tr>)}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </Col>
                </>
              )
          }
        </Row>
      </>
    );
  }
}

const mapDispatchToProps = {
  reset,
  getLobbyStatus,
  lookForGame,
  stopLookingForGame,
  joinGame
}
const mapAppStateToProps = ({ lobby }) => {
  const { loading, waitList, gameList, sending, isLookingForGame, isWaitingForGameStart, error } = lobby;
  return {
    loading,
    sending,
    waitList,
    gameList,
    isWaitingForGameStart,
    isLookingForGame,
    error,
    currentUser: auth.getCurrentUser()
  }
}

export default withRouter(connect(mapAppStateToProps, mapDispatchToProps)(Lobby));