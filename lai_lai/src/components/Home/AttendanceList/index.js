import React from 'react'

import AttendeesApi from '../../../services/api/attendees'

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
  }

  componentDidMount() {
    this.getAttendees()
  }

  getAttendees() {
    AttendeesApi.getAttendees()
    .then(res => {
      let confirmed = 0
      let declined = 0
      let uncertain = 0

      res.forEach(data => {
        if (data.attending) confirmed++
        else if (data.attending === null) uncertain++
        else if (!data.attending) declined++
      })
      this.setState({attendees: res, confirmed: confirmed, declined: declined, uncertain: uncertain})
    })
    .catch(err => console.log(err))
  }

  renderAttendees() {
    let renderAttendees = []
    let attendeesArr = Object.assign([], this.state.attendees)
    attendeesArr.forEach((data,index) => {
      let status
      if (data.attending) status = 'confirmed'
      else if (data.attending === null) status = 'Have not answered.'
      else if (!data.attending) status = 'declined'
      renderAttendees.push(
        <div className="attendanceList-contact" key={index}>
          <div className="attendanceList-contact-name">
            {data.name}
          </div>
          <div className="attendanceList-contact-status">
            {status}
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
