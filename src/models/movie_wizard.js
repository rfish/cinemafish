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
    const { current_movie_name } = this;
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
    if (this.movie_lookup_queue.length > 0) {
      console.log('movie_lookup_queue: ', this.movie_lookup_queue);
      this.current_movie_name = this.movie_lookup_queue[0];
      this.movie_lookup_queue.unshift();
      this.lookupMovieByName();
    }
  }

  @action.bound
  selectMovie = flow(function* (movie) {
    console.log('selectMovie', movie);
    const { session_id } = tmdb;

    this.selected_movie = movie;

    const url = `/list/${this.current_list_id}/add_item`;

    let body = { "media_id": this.selected_movie.id }
    let { data: { status_code } } = yield _axios.post(url, body, { params: { session_id } });
    if (status_code == 201) {
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
    this.movie_lookup_queue = movie_lookup_queue;
    this.nextMovie();
  }
}

const singleton = new MovieWizard();
export default singleton;;
