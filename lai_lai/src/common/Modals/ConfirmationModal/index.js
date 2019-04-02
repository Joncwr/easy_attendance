import React from 'react'

import './index.css'

class DeleteAttendeeModal extends React.Component {
  constructor(){
    super()

    this.state = {
    }

    this.onConfirm=this.onConfirm.bind(this)
  }

  onConfirm() {
    this.props.modalProps.function(this.props.modalProps.value)
    this.props.setModal('hide')
  }

  render() {
    let header
    let style
    if (this.props.modalProps) {
      if (this.props.modalProps.text) header = this.props.modalProps.text
      if (this.props.modalProps.style) style = this.props.modalProps.style
    }
    return (
      <div className="confirmationModal">
        <div className="confirmationModal-header" style={style}>
          {header}
        </div>
        <div className="confirmationModal-actions">
          <div className="confirmationModal-actions-decline" onClick={() => this.props.setModal('hide')}>
            Decline
          </div>
          <div className="confirmationModal-actions-confirm" onClick={this.onConfirm}>
            Confirm
          </div>
        </div>
      </div>
    )
  }
}

export default DeleteAttendeeModal
