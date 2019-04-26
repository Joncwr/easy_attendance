import React from 'react'

import './index.css'

class Input extends React.Component {
  render() {
    return (
      <input
        className={'form-textarea ' + this.props.readOnly}
        style={this.props.style}
        name={this.props.name}
        value={this.props.state}
        type={this.props.type}
        placeholder={this.props.placeholder}
        onChange={this.props.handleChange}
        readOnly={this.props.readOnly}
      />
    )
  }
}

export default Input
