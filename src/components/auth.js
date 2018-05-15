import React, { Component } from 'react';

const Auth = (props) => {
  const request_token = props.request_token;
  const account_id = props.account_id;
  const session_id = props.session_id;

  if (!request_token) {
    return [
      <button onClick={props.makeSession}>Make a session</button>,
      <button onClick={props.authorize}>Authorize</button>,
    ]
  }

  if (!account_id) {
    // props.fetchAccountDetails();
    return <a href="https://www.themoviedb.org/authenticate/{request_token}"
              target="_blank">Authorize app</a>
    // return <div>Make an account</div>
  }

  return (
    <div>session_id: {session_id}</div>
  );
}

export default Auth;
