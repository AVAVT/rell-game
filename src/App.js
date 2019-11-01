import React from 'react';
import './App.scss';
import { Provider as ReduxProvider } from "react-redux";

import Routes from './Routes/';
import { createReduxStore } from './Redux/store';

const reduxStore = createReduxStore();

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <ReduxProvider store={reduxStore}>
          <Routes />
        </ReduxProvider>
      </div>
    );
  }
}

export default App;
