import React, { Component } from 'react';
import logo from '../images/logo.jpg';
import '../style/app.css';

import Auth from './auth';
import MovieGrid from './movie_grid';
import ListPicker from './list_picker'
import AddToListForm from './add_to_list_form'
import MoviePicker from './movie_picker'

import _axios from '../util/networkInterface.js';
import _ from 'lodash';

import tmdb  from '../models/the_movie_db_state'
import wizard  from '../models/movie_wizard'
import {observer}  from 'mobx-react';

@observer
class App extends Component {
  constructor(props) {
    super(props);

    const LS_SESSION_KEY = 'LS_SESSION_KEY';
    const existingSessionId = localStorage.getItem(LS_SESSION_KEY);

    this.state = {
      selectedList: null,
      lists: null,
      movies: null,
      movies_to_add: null
    };
  }

  fetchLists = async () => {
    console.log('fetchLists');
    const { account_id, session_id } = tmdb;

    let {data: {results} } = await _axios.get(`/account/${account_id}/lists`, { params: { session_id } });
    this.setState({ lists: results });
    console.log("setting state for lists to: ", results);

    this.onListSelected(results[0].id)
  }

  onListSelected = async (list_id) => {
    console.log('On List Selected', list_id);
    this.setState({selected_list_id: list_id});
    this.fetchListItems(list_id);
    wizard.setCurrentList(list_id);
  }

  fetchListItems = async (list_id) => {
    let resp = await _axios.get(`/list/${list_id}`);

    const { data: { items } } = resp;
    items.sort(function(a, b){
      var dateA=new Date(a.release_date), dateB=new Date(b.release_date)
      return dateB-dateA //sort by date descending
    });
    this.setState({ movies: items });
  }

  onAddToListSubmit = async (textarea_value) => {
    if (textarea_value) {
      let movies_to_search_for = textarea_value.split("\n");
      this.setState({movies_to_add: movies_to_search_for});
      wizard.setMovieLookupQueue(movies_to_search_for);
    }
  }

  onMoviePicked = (movie) => {
    console.log('onMoviePicked: ', movie);
    wizard.selectMovie(movie);
  }

  onCancelPicker = () => {
    console.log('onCancelPicker');
    wizard.nextMovie();
  }

  render() {
    const {request_token, account_id, session_id, require_authorization} = tmdb;
    const {lists, movies } = this.state;
    console.log("state: ", this.state);
    if (!session_id) {
      if (!request_token) {
        tmdb.getRequestToken();
        return <div>Loading...</div>
      } else if (require_authorization == true) {
        return [
          <button onClick={tmdb.authorize}>Authorize</button>,
        ]
      } else if (request_token && !session_id){
        // if ! authorized
        return [<button onClick={tmdb.makeSession}>Make session</button>]
      }
    }

    if (!account_id) {
      tmdb.fetchAccountDetails();
      return <div>Fetching account details</div>
      // return <div>Make an account</div>
    }

    if (!lists) {
      this.fetchLists();
      return <h1>Fetching lists</h1>
    } else {
      console.log('Lists have been fetched!', lists);
    }

    if (wizard.movie_lookup_queue && wizard.movie_lookup_queue.length > 0) {
      return <MoviePicker name={wizard.current_movie_name}
                movies={wizard.current_movie_choices}
                onMoviePicked={this.onMoviePicked}
                onCancel={this.onCancelPicker} />
    }

    return (
      <div>
        <Auth key={account_id}
              account_id={account_id}
              session_id={session_id}
              request_token={request_token}
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
          <AddToListForm onAddToListSubmit={this.onAddToListSubmit} />
        </div>
      </div>
    );
  }
}

export default App;
