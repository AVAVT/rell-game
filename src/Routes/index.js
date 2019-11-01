import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

import auth from '../blockchain/auth';
import Login from './Login';
import Lobby from './Lobby';
import Game from './Game';
import NodeLocationPrompt from './NodeLocationPrompt';

export const PrivateRoute = ({ component: Component, ...props }) => (
  <Route {...props} render={() => (
    auth.isLoggedIn() ? <Component {...props} /> : <Redirect to="/" />
  )} />
)

class Routes extends React.Component {
  render() {
    return (
      <Router>
        {
          this.props.nodeLocation
            ? (
              <Switch>
                <PrivateRoute path="/lobby" component={Lobby} />
                <PrivateRoute path="/game/:gameId" component={Game} />
                <Route path="/">
                  <Login />
                </Route>
              </Switch>
            )
            : <NodeLocationPrompt />
        }

      </Router>
    );
  }
}

const mapAppStateToProps = ({ config }) => ({ nodeLocation: config.nodeLocation });

export default connect(mapAppStateToProps)(Routes);