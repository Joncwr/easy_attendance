import React from 'react'

import './index.css'

class DeleteAttendeeModal extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      number: '',
    }

    this.onConfirm=this.onConfirm.bind(this)
  }

  onConfirm() {
    this.props.modalProps.function(this.props.modalProps.index)
    this.props.setModal('hide')
  }

  render() {
    let header
    if (this.props.modalProps) {
      header = this.props.modalProps.text
    }
    return (
      <div className="confirmationModal">
        <div className="confirmationModal-header">
          {header}
        </div>
        <div className="confirmationModal-actions">
          <div className="confirmationModal-actions-confirm" onClick={this.onConfirm}>
            Confirm
          </div>
          <div className="confirmationModal-actions-decline" onClick={() => this.props.setModal('hide')}>
            Decline
          </div>
        </div>
      </div>
    )
  }
}

export default DeleteAttendeeModal
