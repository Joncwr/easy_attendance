import React, { Component } from 'react';

import './index.css';

class FloatingButton extends Component {
  render() {
    let { onClick, name, style } = this.props
    return (
      <div
        className="button"
        onClick={() => onClick()}
        style={style}
      >
        {name}
      </div>
    );
  }
}

export default FloatingButton;
