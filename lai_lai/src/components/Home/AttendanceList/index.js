import React from 'react'

import Button from '../../../common/Button'
import AttendeesApi from '../../../services/api/attendees'
import MessageApi from '../../../services/api/messaging'
import AttendanceApi from '../../../services/api/attendance'

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
  }

  componentDidMount() {
    this.getAttendees()
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

  onSave() {
    let saveAttendanceDict = {
      text: 'Save attendance?',
      value: this.state.attendees,
      function: this.saveAttendance.bind(this)
    }

    this.props.setModal('show', 'ConfirmationModal', saveAttendanceDict)
  }

  saveAttendance(attendanceDict) {
    let saveAttendanceDict = {
      group_id: this.props.currentGroup.id,
      event_id: this.props.currentGroup.current_event,
      attendanceDict
    }
    console.log(saveAttendanceDict);
  }

  manualSendLink(name) {
    let attendeesData = Object.assign([], this.props.attendeesData)
    let userDict
    attendeesData.forEach(data => {
      let event_id
      if (this.props.currentGroup) event_id = this.props.currentGroup.current_event
      if (data.name === name) {
        userDict = {
          name: data.name,
          number: data.number,
          id: data.id,
          event_id: event_id
        }
      }
    })
    MessageApi.sendMessage(userDict)
    .then(res => {
      console.log(res);
      this.props.setSnackbar('show', {
        text: "Message sent."
      })
    })
    .catch(err => this.props.setSnackbar('show', {
      text: "Could'nt send message."
    }))
  }

  getAttendees() {
    AttendeesApi.getAttendees()
    .then(attendees => {
      if (this.props.currentGroup) {
        AttendanceApi.getAttendance(this.props.currentGroup.current_event)
        .then(attendance => {
          let confirmed = 0
          let declined = 0
          let uncertain = 0

          attendees.forEach(data => {
            let status = 'blank'
            attendance.forEach(attendance => {
              if (data.id === attendance.attendee_id) {
                if (attendance.status) {
                  status = 'confirmed'
                  confirmed ++
                }
                else if (!attendance.status) {
                  status = 'declined'
                  declined ++
                }
              }
            })
            if (status === 'blank') {
              status = 'Have not answered.'
              uncertain ++
            }
            data['status'] = status
          })
          this.setState({attendees: attendees, confirmed: confirmed, declined: declined, uncertain: uncertain})
        })
        .catch(err => this.props.setSnackbar('show', {
          text: "Could'nt get attendance."
        }))
      }
    })
    .catch(err => console.log(err))
  }

  renderAttendees() {
    let renderAttendees = []
    let attendeesArr = Object.assign([], this.state.attendees)

    attendeesArr.forEach((data,index) => {
      renderAttendees.push(
        <div className="attendanceList-contact" key={index}>
          <div className="attendanceList-contact-name">
            {data.name}
          </div>
          <div className="attendanceList-contact-status">
            {data.status}
          </div>
          <div className="attendanceList-contact-action" onClick={() => this.onPress(data.name)}>
            <div className="attendanceList-contact-action-icon" />
          </div>
        </div>
      )
    })

    return renderAttendees
  }

  render() {
    let { confirmed, declined, uncertain } = this.state
    return (
      <div className="attendanceList">
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
      </div>
    )
  }
}

export default AttendanceList
