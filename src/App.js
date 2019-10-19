import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import moment from 'moment';

import * as services from './blockchain/api';
import { adminUser } from './blockchain/blockchain';
import Routes from './Routes';

class App extends React.Component {
  state = {
    message: '',
    messages: []
  }

  // async componentDidMount() {
  //   // services.createChannel(adminUser, 'example2');
  //   const messages = await services.getMessages('example2');
  //   this.setState({ messages });
  // }

  // sendMessage = async e => {
  //   e.preventDefault();
  //   const messageToSend = this.state.message;
  //   this.setState({ message: '' });
  //   await services.postMessage(adminUser, 'example2', messageToSend);
  //   const messages = await services.getMessages('example2');
  //   this.setState({ messages });
  // }

  // onTextChanged = e => this.setState({ message: e.target.value });

  render() {
    return (
      <div className="container">
        <Routes />
        {/* <header className="App-header">
          {this.state.messages.map(message => (<div key={message.timestamp}>
            <div>[{moment(new Date(message.timestamp)).fromNow()}] <strong>{message.posted_by}</strong>:</div>
            <p>{message.text}</p>
          </div>)
          )}
          <form onSubmit={this.sendMessage}>
            <input type="text" value={this.state.message} onChange={this.onTextChanged} />
          </form>
        </header> */}
      </div>
    );
  }
}

export default App;
