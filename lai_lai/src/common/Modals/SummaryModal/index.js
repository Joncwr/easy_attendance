import React from 'react'

import './index.css'

class SummaryModal extends React.Component {
  constructor(){
    super()

    this.state = {

    }

  }

  render() {
    let style
    if (this.props.modalProps) {
      if (this.props.modalProps.style) style = this.props.modalProps.style
    }
    return (
      <div className="summaryModal">
        <div className="summaryModal-header" style={style}>
          Attendance Summary
        </div>
      </div>
    )
  }
}

export default SummaryModal
