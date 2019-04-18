import React from 'react'

import './index.css'

class CheckBox extends React.Component {
  render() {
    return (
      <div className="checkBox">
        <div className={"checkBox-container " + this.props.checkbox} onClick={() => this.props.setCheckbox(this.props.index)}>
          <div className={"checkBox-container-icon " + this.props.checkbox} />
      	</div>
      </div>
    )
  }
}

export default CheckBox
