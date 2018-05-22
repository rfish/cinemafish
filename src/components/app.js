import React, { Component } from 'react';
import logo from '../images/logo.jpg';
import '../style/app.css';

import Auth from './auth';
import MovieGrid from './movie_grid';
import ListPicker from './list_picker'

import _axios from '../util/networkInterface.js';
import _ from 'lodash';

import appstate  from '../models'

class App extends Component {
  constructor(props) {
    super(props);

    const LS_SESSION_KEY = 'LS_SESSION_KEY';
    const existingSessionId = localStorage.getItem(LS_SESSION_KEY);

    this.state = {
      account_id: null,
      request_token: null,
      session_id: existingSessionId,
      require_authorization: true,
      selectedList: null,
      lists: null,
      movies: null
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
    let { data: { id } } = await _axios.get("/account", { params: { session_id } });
    this.setState({ account_id: id });
  }

  fetchLists = async () => {
    console.log('fetchLists');
    const { account_id, session_id } = this.state;

    let {data: {results} } = await _axios.get(`/account/${account_id}/lists`, { params: { session_id } });
    this.setState({ lists: results });
    console.log("setting state for lists to: ", results);

    this.onListSelected(results[0].id)
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

  onListSelected = async (list_id) => {
    console.log('On List Selected', list_id);
    this.setState({selected_list_id: list_id});
    this.fetchListItems(list_id);
  }

  fetchListItems = async (list_id) => {
    let resp = await _axios.get(`/list/${list_id}`);

    const { data: { items } } = resp;
    this.setState({ movies: items });
  }

  render() {
    const {request_token, account_id, session_id, require_authorization, lists, movies } = this.state;
    console.log("state: ", this.state);
    if (!session_id) {
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
    }

    if (!account_id) {
      this.fetchAccountDetails();
      return <div>Fetching account details</div>
      // return <div>Make an account</div>
    }

    if (!lists) {
      this.fetchLists();
      return <h1>Fetching lists</h1>
    } else {
      console.log('Lists have been fetched!', lists);
    }

    return (
      <div>
      {appstate.a}
      <button onClick={() => appstate.a = 8} />

        {/*}<Auth key={this.state.account_id}
              account_id={this.state.account_id}
              session_id={this.state.session_id}
              request_token={this.state.request_token}
        />
        <div className="app">
          <header className="app-header">
            <img src={logo} className="app-logo" alt="logo" />
            <h1 className="app-title">Cinema Fish</h1>
            <ListPicker lists={this.state.lists}
              onListSelected={this.onListSelected} />
            <br />
          </header>
          <br />
          <MovieGrid movies={this.state.movies} />
        </div>*/}
      </div>
    );
  }
}

export default App;
