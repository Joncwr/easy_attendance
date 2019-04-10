import React from 'react'

import './index.css'

class RadioButton extends React.Component {
  render() {
    return (
      <div className="radioButton">
        <div className="radioButton-container" onClick={this.props.setRadioButton}>
          <div className={"radioButton-container-icon " + this.props.radioButton} />
      	</div>
      </div>
    )
  }
}

export default RadioButton
