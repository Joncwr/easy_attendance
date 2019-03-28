import React, { Component } from 'react';

import './index.css';

class FloatingButton extends Component {
  render() {
    if (this.props.isLoading) {
      return (
        <div className="LoadingOverlay">
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      )
    }
    else {
      return null
    }
  }
}

export default FloatingButton;
