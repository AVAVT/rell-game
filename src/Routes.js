import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import auth from './blockchain/auth';
import Login from './Routes/Login';
import Lobby from './Routes/Lobby';

export const PrivateRoute = ({ component: Component, ...props }) => (
  <Route {...props} render={() => (
    auth.isLoggedIn() ? <Component {...props} /> : <Redirect to="/" />
  )} />
)

export default class Routes extends React.Component {
  render() {
    console.log(auth.isLoggedIn());
    return (
      <Router>
        <div>
          <Switch>
            <PrivateRoute path="/lobby" component={Lobby} />
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}