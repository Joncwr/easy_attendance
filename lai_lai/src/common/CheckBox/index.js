import React from 'react'

import './index.css'

class CheckBox extends React.Component {
  render() {
    return (
      <div className="checkBox">
        <div className={"checkBox-container " + this.props.checkBox} onClick={this.props.setCheckBox}>
          <div className={"checkBox-container-icon " + this.props.checkBox} />
      	</div>
      </div>
    )
  }
}

export default CheckBox
