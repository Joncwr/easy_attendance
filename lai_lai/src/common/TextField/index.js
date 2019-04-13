import React from 'react'

import './index.css'

class Input extends React.Component {
  render() {
    return (
      <div>
        <input
          className='form-textarea'
          style={this.props.style}
          name={this.props.name}
          value={this.props.state}
          type={this.props.type}
          placeholder={this.props.placeholder}
          onChange={this.props.handleChange}
        />
      </div>
    )
  }
}

export default Input
