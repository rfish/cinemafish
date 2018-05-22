import { observable, autorun, action, runInAction, configure, flow } from 'mobx';

import _axios from '../util/networkInterface.js';

configure({enforceActions: false});

const LS_SESSION_KEY = 'LS_SESSION_KEY';

class TheMovieDBState {
  @observable account_id = null
  @observable request_token = null
  @observable session_id = localStorage.getItem(LS_SESSION_KEY)
  @observable require_authorization = true

  @action.bound
  getRequestToken = async () => {
    let {data: {request_token} } = await _axios.get("/authentication/token/new");
    this.request_token = request_token;
  }

  @action.bound
  authorize = () => {
    const { request_token } = this;
    console.log(request_token);
    const url = `https://www.themoviedb.org/authenticate/${request_token}`;
    console.log(url);
    window.open(url, '_blank');
    this.require_authorization = false
  }

  @action.bound
  getRequestToken = flow(function* () {
    let {data: {request_token} } = yield _axios.get("/authentication/token/new");
    this.request_token = request_token;
  });

  @action.bound
  fetchAccountDetails = flow(function* () {
    const { session_id } = this;
    let { data: { id } } = yield _axios.get("/account", { params: { session_id } });
    this.account_id = id;
  });

  @action.bound
  makeSession = flow(function* () {
    console.log('Make session')

    let existingSessionId = localStorage.getItem(LS_SESSION_KEY);
    if (existingSessionId) return this.session_id = existingSessionId;

    const { request_token } = this;

    try {
      let resp = yield _axios.get('/authentication/session/new', { params: { request_token } });

        const { data: { session_id } } = resp;
        this.session_id = session_id;
        localStorage.setItem(LS_SESSION_KEY, session_id);
    } catch (error) {
      // we are probably not authorized
      this.require_authorization = true;
    }
  });
}

const singleton = new TheMovieDBState();
export default singleton;;
