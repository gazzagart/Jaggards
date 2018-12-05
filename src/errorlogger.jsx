import React from 'react';

const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

class ErrorLogger extends React.Component {
  componentDidMount() {
    this.props.history.push("/main/");
  }

  render() {
    return (
        <div></div>
    );
  }
}
export default ErrorLogger