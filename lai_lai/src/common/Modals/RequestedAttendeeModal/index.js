import React from 'react'

import AttendeesApi from '../../../services/api/attendees'

import './index.css'

class RequestedAttendee extends React.Component {
  constructor(){
    super()

    this.state = {
      requestAttendee: []
    }
  }

  componentDidMount() {
    let { id } = this.props.modalProps.group
    AttendeesApi.getRequestedAttendees(id)
    .then(res => {
      this.setState({requestAttendee: res})
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: 'Please refresh the page.'
    }))
  }

  renderRequestedAttendees() {
    let requestAttendee = Object.assign([], this.state.requestAttendee)
    if (requestAttendee.length > 0) {
      let renderRequestedAttendees = []
      requestAttendee.forEach((data, index) => {
        renderRequestedAttendees.push(
          <div className="requestedAttendeeModal-main-attendee" key={index}>
            <div className="requestedAttendeeModal-main-attendee-name">{data.name}</div>
            <div className="requestedAttendeeModal-main-attendee-number">{data.number}</div>
            <div className="requestedAttendeeModal-main-attendee-email">{data.email}</div>
            <div className="requestedAttendeeModal-main-attendee-telegram">{data.telegram_id}</div>
          </div>
        )
      })

      return (
        <div>
          <div className='requestedAttendeeModal-main-header'>
            <div className="requestedAttendeeModal-main-header-name">Name</div>
            <div className="requestedAttendeeModal-main-header-number">Number</div>
            <div className="requestedAttendeeModal-main-header-email">Email</div>
            <div className="requestedAttendeeModal-main-header-telegram">Telegram</div>
          </div>
          {renderRequestedAttendees}
        </div>
      )
    }
    else {
      return (
        <div className="requestedAttendeeModal-main-empty">No requested attendees.</div>
      )
    }
  }

  render() {
    return (
      <div className="requestedAttendeeModal">
        <div className="requestedAttendeeModal-header">
          <div className="requestedAttendeeModal-header-text">Requested Attendees</div>
        </div>
        <div className="requestedAttendeeModal-main">
          {this.renderRequestedAttendees()}
        </div>
        <div className="modal-bottom--default" />
      </div>
    )
  }
}

export default RequestedAttendee
