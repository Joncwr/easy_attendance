import React from 'react'

import './index.css'

class CheckBox extends React.Component {
  onClick() {
    if (!this.props.extraFields) {
      this.props.setCheckbox(this.props.index)
    }
    else {
      this.props.setCheckbox(this.props.eventOptionsIndex, 'extraFields', this.props.index)
    }
  }

  render() {
    return (
      <div className="checkBox">
        <div className={"checkBox-container " + this.props.checkbox} onClick={this.onClick.bind(this)}>
          <div className={"checkBox-container-icon " + this.props.checkbox} />
      	</div>
      </div>
    )
  }
}

export default CheckBox
