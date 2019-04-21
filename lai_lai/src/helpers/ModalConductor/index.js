import React from 'react'

import AddAttendeeModal from '../../common/Modals/AddAttendeeModal'
import EditInputModal from '../../common/Modals/EditInputModal'
import ConfirmationModal from '../../common/Modals/ConfirmationModal'
import EventsModal from '../../common/Modals/EventsModal'
import MoreEventOptionsModal from '../../common/Modals/MoreEventOptionsModal'
import EditAttendanceModal from '../../common/Modals/EditAttendanceModal'
import EditTagsModal from '../../common/Modals/EditTagsModal'
import AttendanceStatisticsModal from '../../common/Modals/AttendanceStatisticsModal'
import SummaryModal from '../../common/Modals/SummaryModal'

import './index.css'

class ModalComponent extends React.Component {
  renderChildren(name){
    switch (name){
      case "AddAttendeeModal" :
        return  <AddAttendeeModal
                  modalProps={this.props.modalProps}
                  setModal={this.props.setModal}
                />

      case "EditInputModal" :
        return  <EditInputModal
                 modalProps={this.props.modalProps}
                 setModal={this.props.setModal}
                />

      case "ConfirmationModal" :
        return  <ConfirmationModal
                  modalProps={this.props.modalProps}
                  setModal={this.props.setModal}
                />
      case "EventsModal" :
        return  <EventsModal
                 modalProps={this.props.modalProps}
                 setModal={this.props.setModal}
                />
      case "MoreEventOptionsModal" :
        return  <MoreEventOptionsModal
                  modalProps={this.props.modalProps}
                  setModal={this.props.setModal}
                />
      case "EditAttendanceModal" :
        return  <EditAttendanceModal
                  modalProps={this.props.modalProps}
                  setModal={this.props.setModal}
                />
      case "EditTagsModal" :
        return  <EditTagsModal
                  modalProps={this.props.modalProps}
                  setModal={this.props.setModal}
                />
      case "AttendanceStatisticsModal" :
        return  <AttendanceStatisticsModal
                  modalProps={this.props.modalProps}
                  setModal={this.props.setModal}
                />
      case "SummaryModal" :
        return  <SummaryModal
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
