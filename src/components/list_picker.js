import React, { Component } from 'react';

import _axios from '../util/networkInterface.js';
import _ from 'lodash';

const ListPicker = (props) => {
  if (!props.lists) {
    return <div>Loading lists...</div>;
  }

  const optionsUI = props.lists.map((list) => {
    return <option value={list.id}>{list.name}</option>
  });

  return <select onChange={event => props.onListSelected(event.target.value) }>
            {optionsUI}
         </select>;
}

export default ListPicker;
