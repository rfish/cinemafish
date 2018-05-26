import { observable, autorun, action, runInAction, configure, flow } from 'mobx';

import tmdb  from '../models/the_movie_db_state'

import _axios from '../util/networkInterface.js';

configure({enforceActions: false});

class MovieWizard {
  @observable current_movie_name = null
  @observable current_movie_choices = null
  @observable selected_movie = null
  @observable movie_lookup_queue = null
  @observable current_list_id = null

  @action.bound
  lookupMovieByName = flow(function* () {
    const { current_movie_name, current_movie_choices } = this;
    console.log('lookupMovieByName', current_movie_name);

    let { data: { results } } = yield _axios.get("/search/movie", { params: { query: current_movie_name } });
    this.current_movie_choices = results;
    if (this.current_movie_choices.length == 1) {
      this.selectMovie(this.current_movie_choices[0]);
    }
  });

  @action.bound
  nextMovie = () => {
    console.log('nextMovie');
    this.selected_movie = null;
    this.current_movie_choices = null;
    if (this.movie_lookup_queue.length > 0) {
      console.log('movie_lookup_queue: ', this.movie_lookup_queue);
      this.current_movie_name = this.movie_lookup_queue[0];
      this.movie_lookup_queue.shift();
      this.lookupMovieByName();
    } else {
      this.movie_lookup_queue = null;
    }
  }

  @action.bound
  selectMovie = flow(function* (movie) {
    console.log('selectMovie', movie.id);
    const { session_id } = tmdb;

    this.selected_movie = movie;

    const url = `/list/${this.current_list_id}/add_item`;

    let body = { "media_id": this.selected_movie.id }
    try {
      let { data: { status_code } } = yield _axios.post(url, body, { params: { session_id } });
      if (status_code == 201) {
        this.nextMovie();
      } else {
        console.log('There may have been a problem.', status_code);
        this.nextMovie();
      }
    } catch (err) {
      console.log("Error caught trying to select movie: ", movie.title, err);
      this.nextMovie();
    }
  });

  @action.bound
  setCurrentList = (current_list_id) => {
    console.log('setCurrentList', current_list_id);
    this.current_list_id = current_list_id;
  };

  @action.bound
  setMovieLookupQueue = (movie_lookup_queue) => {
    console.log('setMovieLookupQueue', movie_lookup_queue);
    this.movie_lookup_queue = movie_lookup_queue.sort(function(a, b){
      var nameA=a.title.toLowerCase(), nameB=b.title.toLowerCase();
      if (nameA < nameB) //sort string ascending
          return -1
      if (nameA > nameB)
          return 1
      return 0 //default return value (no sorting)
    });
    this.nextMovie();
  }
}

const singleton = new MovieWizard();
export default singleton;;
