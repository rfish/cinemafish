import React, { Component } from 'react';

class AddToListForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onAddToListSubmit(this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Movies to Add
          <br />
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Lookup Movies" />
      </form>
    );
  }
}

export default AddToListForm;
