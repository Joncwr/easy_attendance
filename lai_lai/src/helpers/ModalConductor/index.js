import React from 'react'

import AddAttendeeModal from '../../common/Modals/AddAttendeeModal'
import ChangeEventModal from '../../common/Modals/ChangeEventModal'
import ConfirmationModal from '../../common/Modals/ConfirmationModal'

import './index.css'

class ModalComponent extends React.Component {
  renderChildren(name){
    switch (name){
      case "AddAttendeeModal":
        return <AddAttendeeModal
                  modalProps={this.props.modalProps}
                  setModal={this.props.setModal}
               />

             case "ChangeEventModal":
       return <ChangeEventModal
                 modalProps={this.props.modalProps}
                 setModal={this.props.setModal}
              />

      case "ConfirmationModal":
        return <ConfirmationModal
                  modalProps={this.props.modalProps}
                  setModal={this.props.setModal}
               />

      default:
        return null
    }
  }

  render() {
    let { modalName, modalStatus } = this.props

    if (modalStatus === 'show') {
      return (
        <div className="modal">
          <div className="modal-overlay" onClick={() => this.props.setModal('hide')}/>
          <div className="modal-container defaultModal" onMouseDown={e => e.stopPropagation()}>
            {this.renderChildren(modalName)}
          </div>
        </div>
      )
    }
    else {
      return null
    }
  }
}

export default ModalComponent
