import React from 'react'

import './index.css'

class AttendanceList extends React.Component {
  constructor(){
    super()

    this.state = {
      attendeesDict: {},
      confirmed: 0,
      declined: 0,
      uncertain: 0,
    }
    this.getAttendees=this.getAttendees.bind(this)
    this.renderAttendees=this.renderAttendees.bind(this)
  }

  componentDidMount() {
    this.getAttendees()

    // let test2 = {
    //   Jonnie: "decline",
    //   Crystal: "decline",
    //   Alvin: "decline",
    //   Tong: "confirm",
    //   Dennis: "decline",
    //   Jerrold: "confirm",
    //   Jeree: "decline",
    //   Feline: "confirm",
    // }
    let test = [
      {name: "Jonnie", number: "+6585337512"},
      {name: "Crystal", number: "+85718541"},
      {name: "Alvin", number: "+6581804690"},
      // {name: "Jerrold", number: ""},
      // {name: "Dennis", number: ""},
      // {name: "Tong", number: ""},
      // {name: "Feline", number: ""},
      // {name: "Jeree", number: ""},
      // {name: "Gooo", number: ""},
    ]
    localStorage.setItem('attendees', JSON.stringify(test))
    // localStorage.setItem('attendanceSheet', JSON.stringify(test2))
  }

  getAttendees() {
    let attendees = JSON.parse(localStorage.getItem('attendees'))
    let attendeesDict = {}
    attendees.forEach(data => {
      attendeesDict[data.name] = 'Have not answered.'
    })

    let attendanceSheetDict = JSON.parse(localStorage.getItem('attendanceSheet'))

    for (var key in attendanceSheetDict) {
      if (attendanceSheetDict.hasOwnProperty(key)) {
        for (var key2 in attendeesDict) {
          if (attendeesDict.hasOwnProperty(key2)) {
              if (key === key2) {
                attendeesDict[key] = attendanceSheetDict[key]
              }
          }
        }
      }
    }

    let confirmed = 0
    let declined = 0
    let uncertain = 0
    for (var key3 in attendeesDict) {
      if (attendeesDict.hasOwnProperty(key3)) {
        if (attendeesDict[key] === 'confirm') confirmed++
        if (attendeesDict[key] === 'decline') declined++
        if (attendeesDict[key] === 'Have not answered.') uncertain++
      }
    }

    this.setState({attendeesDict: attendeesDict, confirmed: confirmed, declined: declined, uncertain: uncertain})
  }

  renderAttendees() {
    let renderAttendees = []
    let attendeesDict = Object.assign({}, this.state.attendeesDict)
    for (var key in attendeesDict) {
      if (attendeesDict.hasOwnProperty(key)) {
        renderAttendees.push(
          <div className="attendanceList-contact" key={key}>
            <div className="attendanceList-contact-name">
              {key}
            </div>
            <div className="attendanceList-contact-status">
              {attendeesDict[key]}
            </div>
          </div>
        )
      }
    }

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
