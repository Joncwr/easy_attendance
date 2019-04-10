import React from 'react'

import AttendeesApi from '../../../services/api/attendees'
import MessageApi from '../../../services/api/messaging'
import AttendanceApi from '../../../services/api/attendance'
import EventsApi from '../../../services/api/events'

import './index.css'

class AttendanceList extends React.Component {
  constructor(){
    super()

    this.state = {
      attendees: [],
      confirmed: 0,
      declined: 0,
      uncertain: 0,
    }
    this.getAttendees=this.getAttendees.bind(this)
    this.renderAttendees=this.renderAttendees.bind(this)
    this.onPress=this.onPress.bind(this)
    this.openEventsModal=this.openEventsModal.bind(this)
  }

  componentDidMount() {
    this.getAttendees()

    // DELETE!!!
    // this.props.setModal('show', 'MoreEventOptionsModal', this.props.currentGroup.events)
  }

  componentWillUpdate(prevProps) {
    if (prevProps.currentGroup !== this.props.currentGroup) {
      this.getAttendees()
    }
  }

  onPress(name) {
    let manualSendDict = {
      text: 'Manually send link to ' + name + '?',
      value: name,
      style: {fontSize: '1.5em'},
      function: this.manualSendLink.bind(this)
    }

    this.props.setModal('show', 'ConfirmationModal', manualSendDict)
  }

  manualSendLink(name) {
    let attendeesData = Object.assign([], this.props.attendeesData)
    let userDict
    attendeesData.forEach(data => {
      let event_id
      if (this.props.currentGroup) event_id = this.props.currentGroup.current_event
      console.log(event_id);
      if (data.name === name) {
        userDict = {
          name: data.name,
          number: data.number,
          id: data.id,
          event_id: event_id,
          message: 'bible study coming up! Your'
        }
      }
    })
    MessageApi.sendMessage(userDict)
    .then(res => {
      this.props.getUser()
      this.props.setSnackbar('show', {
        text: "Message sent."
      })
    })
    .catch(err => this.props.setSnackbar('show', {
      text: "Could'nt send message."
    }))
  }

  getAttendees() {
    let currentGroupId = this.props.currentGroup.id || ''
    let currentEventId = this.props.currentGroup.current_event || ''
    if (currentGroupId) {
      AttendeesApi.getAttendees(currentGroupId)
      .then(attendees => {
        if (currentEventId) {
          AttendanceApi.getAttendance(currentEventId)
          .then(attendance => {
            let confirmed = 0
            let declined = 0
            let uncertain = 0

            attendees.forEach(data => {
              let status = 'Have not sent link.'
              attendance.forEach(attendance => {
                if (data.id === attendance.attendee_id) {
                  if (attendance.status) {
                    status = 'confirmed'
                    confirmed ++
                  }
                  else if (attendance.status === null) {
                    status = 'Have not answered.'
                    uncertain ++
                  }
                  else if (attendance.status === false) {
                    status = 'declined'
                    declined ++
                  }
                  data['message_status'] = attendance.message_status
                }
              })
              data['status'] = status
            })
            this.setState({attendees: attendees, confirmed: confirmed, declined: declined, uncertain: uncertain})
          })
          .catch(err => this.props.setSnackbar('show', {
            text: "Could'nt get attendance."
          }))
        }
      })
      .catch(err => this.props.setSnackbar('show', {
        text: "Please refresh the page."
      }))
    }
    else {
      this.props.setSnackbar('show', {
        text: "Please refresh the page."
      })
    }
  }

  renderAttendees() {
    let renderAttendees = []
    let attendeesArr = Object.assign([], this.state.attendees)
    attendeesArr.forEach((data,index) => {
      renderAttendees.push(
        <div className="attendanceList-contact" key={index}>
          <div className="attendanceList-contact-messageStatus">
            <div className={"attendanceList-contact-messageStatus-icon " + data.message_status} / >
          </div>
          <div className="attendanceList-contact-name">
            {data.name}
          </div>
          <div className="attendanceList-contact-status">
            {data.status}
          </div>
          {this.renderActions(data.name)}
        </div>
      )
    })

    return renderAttendees
  }

  renderActions(name) {
    let currentGroup = Object.assign({}, this.props.currentGroup)
    if (currentGroup.events) {
      if (!currentGroup.events.closed) {
        return (
          <div className="attendanceList-contact-action" onClick={() => this.onPress(name)}>
            <div className="attendanceList-contact-action-icon" />
          </div>
        )
      }
    }
  }

  openEventsModal() {
    let groupId = this.props.currentGroup.id || ''
    if (groupId) {
      let eventModalDict = {
        groupId,
        setSnackbar: this.props.setSnackbar,
        getUser: this.props.getUser,
      }
      this.props.setModal('show', 'EventsModal', eventModalDict)
    }
    else {
      this.props.setSnackbar('show', {
        text: "Please refresh the page."
      })
    }
  }

  openEventStatusModal(status) {
    let text
    if (status === 'open') text = 'Close event?'
    if (status === 'closed') text = 'Open event again?'
    let setEventStatusDict = {
      text,
      value: status,
      function: this.setEventsStatus.bind(this),
    }

    this.props.setModal('show', 'ConfirmationModal', setEventStatusDict)
  }

  setEventsStatus(status) {
    if (this.props.currentGroup.events) {
      let isEventClosed
      if (status === 'closed') isEventClosed = false
      if (status === 'open') isEventClosed = true

      let setEventStatusDict = {
        event_id: this.props.currentGroup.events.id,
        isEventClosed
      }

      EventsApi.setEventStatus(setEventStatusDict)
      .then(res => {
        this.props.getUser()
      })
      .catch(err => this.props.setSnackbar('show', {
        text: "Could'nt set event status."
      }))
    }
  }

  render() {
    let { confirmed, declined, uncertain } = this.state
    let currentEventName = ' - '
    let isEventClosed = 'blank'
    if (this.props.currentGroup.events) {
      currentEventName = this.props.currentGroup.events.name
      if (!this.props.currentGroup.events.closed) isEventClosed = 'open'
      else if (this.props.currentGroup.events.closed) isEventClosed = 'closed'
    }
    return (
      <div className="attendanceList">
        <div className="attendanceList-header">
          <div className="attendanceList-header-eventInfo">
            <div className="attendanceList-header-eventInfo-text">
              {currentEventName}
            </div>
            <div className="attendanceList-header-eventInfo-eventsIcon" onClick={this.openEventsModal}/>
          </div>
        </div>
        <div className="attendanceList--mainWrapper">
          {this.renderAttendees()}
        </div>
        <div className="attendanceList-stats">
          <div className="attendanceList-stats-confirm">
            <div className="attendanceList-stats-header">
              Confirmed:
            </div>
            <div className="attendanceList-stats-value">
              {confirmed}
            </div>
          </div>
          <div className="attendanceList-stats-declined">
            <div className="attendanceList-stats-header">
              Declined:
            </div>
            <div className="attendanceList-stats-value">
              {declined}
            </div>
          </div>
          <div className="attendanceList-stats-null">
            <div className="attendanceList-stats-header">
              Uncertain:
            </div>
            <div className="attendanceList-stats-value">
              {uncertain}
            </div>
          </div>
        </div>
        <div className="attendanceList-options">
          <div className="attendanceList-options-extraOptions">
            <div className="attendanceList-options-extraOptions-icon" onClick={() => this.props.setModal('show', 'MoreEventOptionsModal', this.props.currentGroup.events)}/>
          </div>
          <div className="attendanceList-options-save">
            <div className={"attendanceList-options-save-icon " + isEventClosed} onClick={() => this.openEventStatusModal(isEventClosed)}/>
          </div>
        </div>
      </div>
    )
  }
}

export default AttendanceList
