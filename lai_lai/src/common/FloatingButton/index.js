import React, { Component } from 'react';

import './index.css';

class FloatingButton extends Component {
  render() {
    return (
      <div className="floatingbutton" onClick={this.props.function}>
        <div className="floatingbutton-text">
          +
        </div>
      </div>
    );
  }
}

export default FloatingButton;
