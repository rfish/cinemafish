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
      session_id: null,
      require_authorization: true
    };
  }

  authorize = async () => {
    const { request_token } = this.state;
    console.log(request_token);
    const url = `https://www.themoviedb.org/authenticate/${request_token}`;
    console.log(url);
    window.open(url, '_blank');
    this.setState({require_authorization: false})
  }

  getRequestToken = async () => {
    let {data: {request_token} } = await _axios.get("/authentication/token/new");
    this.setState({ request_token });
  }

  fetchAccountDetails = async () => {
    const { session_id } = this.state;
    let { data: { id } } = await _axios.get("/account",  { params: { session_id } });
    this.setState({ account_id: id });
  }

  makeSession = async () => {
    console.log('Make session');
    const LS_SESSION_KEY = 'LS_SESSION_KEY';

    let existingSessionId = localStorage.getItem(LS_SESSION_KEY);
    if (existingSessionId) return this.setState({ session_id: existingSessionId });

    const { request_token } = this.state;

    try {
      let resp = await _axios.get('/authentication/session/new', { params: { request_token } });
      console.log('Make session resp: ', resp);
      const { data: { session_id } } = resp;
      this.setState({ session_id });
      localStorage.setItem(LS_SESSION_KEY, session_id);
    } catch (error) {
      // we are probably not authorized
      this.setState({require_authorization: true})
    }
  }


  render() {

    const {request_token, account_id, session_id, require_authorization} = this.state;
    console.log("state: ", this.state);

    if (!request_token) {
      this.getRequestToken();
      return <div>Loading...</div>
    } else if (require_authorization == true) {
      return [
        <button onClick={this.authorize}>Authorize</button>,
      ]
    } else if (request_token && !session_id){
      // if ! authorized
      return [<button onClick={this.makeSession}>Make session</button>]
    }


    if (!account_id) {
      this.fetchAccountDetails();
      return <div>Fetching account details</div>
      // return <div>Make an account</div>
    }

    return (
      <div>
        <Auth key={this.state.account_id}
              account_id={this.state.account_id}
              session_id={this.state.session_id}
              request_token={this.state.request_token}
        />
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
