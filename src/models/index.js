import { observable, autorun, action, runInAction } from 'mobx';

import _axios from '../util/networkInterface.js';

const LS_SESSION_KEY = 'LS_SESSION_KEY';

class TheMovieDBState {
  @observable account_id = null
  @observable request_token = null
  @observable session_id = localStorage.getItem(LS_SESSION_KEY)
  @observable require_authorization = true

  @action.bound
  getRequestToken = async () => {
    let {data: {request_token} } = await _axios.get("/authentication/token/new");
    runInAction(() => {
      this.request_token = request_token;
    });
  }

  @action.bound
  authorize = async () => {
    const { request_token } = this;
    console.log(request_token);
    const url = `https://www.themoviedb.org/authenticate/${request_token}`;
    console.log(url);
    window.open(url, '_blank');
    runInAction(() => {
      this.require_authorization = false
    })
  }

  @action.bound
  getRequestToken = async () => {
    let {data: {request_token} } = await _axios.get("/authentication/token/new");
    runInAction(() => {
      this.request_token = request_token;
    });
  }

  @action.bound
  fetchAccountDetails = async () => {
    const { session_id } = this;
    let { data: { id } } = await _axios.get("/account", { params: { session_id } });
    runInAction(() => {
      this.account_id = id;
    });

  }

  @action.bound
  makeSession = async () => {
    console.log('Make session')

    let existingSessionId = localStorage.getItem(LS_SESSION_KEY);
    if (existingSessionId) return this.session_id = existingSessionId;

    const { request_token } = this;

    try {
      let resp = await _axios.get('/authentication/session/new', { params: { request_token } });
      runInAction(() => {
        const { data: { session_id } } = resp;
        this.session_id = session_id;
        localStorage.setItem(LS_SESSION_KEY, session_id);
      });
    } catch (error) {
      // we are probably not authorized
      runInAction(() => {
        this.require_authorization = true;
      });
    }
  }
}

const singleton = new TheMovieDBState();
export default singleton;
