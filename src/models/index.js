

class DummyClass {
  a = 5;
}

export default new DummyClass();

// const LS_SESSION_KEY = 'LS_SESSION_KEY';

// class TheMovieDBState {
//   account_id: null
//   request_token: null
//   session_id: localStorage.getItem(LS_SESSION_KEY)
//   require_authorization: true
//
//
//
//   getRequestToken = async () => {
//     let {data: {request_token} } = await _axios.get("/authentication/token/new");
//     this.request_token = request_token;
//   }
// }
//
// const singleton = new TheMovieDBState();
// export default singleton;
