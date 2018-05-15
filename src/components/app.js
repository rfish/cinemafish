import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../style/app.css';

import Auth from './auth';
import MovieList from './movie_list';

import _axios from '../util/networkInterface.js';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account_id: null,
      request_token: null,
      session_id: null
    };
  }

  authorize = async () => {
    window.open('https://www.themoviedb.org/authenticate/{request_token}', '_blank');
  }

  fetchAccountDetails = async () => {
    const { session_id } = this.state;
    let { data: { id } } = await _axios.get("/account",  { params: { session_id } });
    this.setState({ account_id: id });
  }

  makeAccount = async () => {
    console.log('makeAccount');
    let { data: { request_token } } = await _axios.get("/authentication/token/new");
    this.setState({ request_token });
  }

  makeSession = async () => {
    const LS_SESSION_KEY = 'LS_SESSION_KEY';

    let existingSessionId = localStorage.getItem(LS_SESSION_KEY);
    if (existingSessionId) return this.setState({ session_id: existingSessionId });

    const { request_token } = this.state;

    let resp = await _axios.get('/authentication/session/new', { params: { request_token } });
    const { data: { session_id } } = resp;
    this.setState({ session_id });
    localStorage.setItem(LS_SESSION_KEY, session_id);
  }


  render() {
    return (
      <div>
        <Auth key={this.state.account_id}
              account_id={this.state.account_id}
              fetchAccountDetails={this.fetchAccountDetails}
              session_id={this.state.session_id}
              makeSession={this.makeSession}
              request_token={this.state.request_token}
              makeAccount={this.makeAccount}
              authorize={this.authorie} />
        <div className="app">
          <header className="app-header">
            <img src={logo} className="app-logo" alt="logo" />
            <h1 className="app-title">Welcome to React</h1>
          </header>
          <p className="app-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </div>
    );
  }
}

export default App;
