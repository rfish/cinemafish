import axios from 'axios';
import _ from 'lodash';
import secrets from '../secrets.json';

let singleton = axios.create({
  baseURL: 'https://api.themoviedb.org/3'
});

singleton.interceptors.request.use(config =>
    _.merge(config, { params: {api_key: secrets.api_key} })
  );

export default singleton;
// const doIt = async () => {
//   let {data: {request_token} } = await singleton.get("/authentication/token/new");
//   let {data: {session_id}} = await singleton.get('/authentication/session/new',
//     {params: {request_token}});
//   console.log(session_id)
// }
//
// doIt()
