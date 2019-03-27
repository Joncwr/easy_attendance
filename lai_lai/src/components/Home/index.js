import React, { Component } from 'react';

import FloatingButton from '../../common/FloatingButton'

import './index.css';

class Home extends Component {
  constructor(){
    super()

    this.state = {
      date: '',
      attendeesData: [],
    }
    this.addAttendee=this.addAttendee.bind(this)
    this.changeDate=this.changeDate.bind(this)
    this.onAddAttendee=this.onAddAttendee.bind(this)
    this.onDelete=this.onDelete.bind(this)
    this.onSend=this.onSend.bind(this)
  }

  addAttendee() {
    this.props.setModal('show', 'AddAttendeeModal', this.onAddAttendee)
  }

  changeDate(date) {
    this.setState({date: date},() => {
      localStorage.setItem('period', JSON.stringify(date))
    })
  }

  onAddAttendee(name, number) {
    let attendeesData = Object.assign([], this.state.attendeesData)
    attendeesData.push({
      'name': name,
      'number': number
    })
    this.setState({attendeesData: attendeesData},() => {
      localStorage.setItem('attendees', JSON.stringify(attendeesData))
    })
  }

  componentDidMount() {
    // localStorage.setItem('attendees', JSON.stringify(test))

    let attendeesData = JSON.parse(localStorage.getItem('attendees'))
    let date = JSON.parse(localStorage.getItem('period'))
    if (attendeesData) this.setState({attendeesData: attendeesData, date: date})
  }

  renderAttendees() {
    let renderAttendees = []
    let attendeesArr = Object.assign([], this.state.attendeesData)

    attendeesArr.forEach((data,index) => {
      renderAttendees.push(
        <div className="home-attendees-info" key={index}>
          <div className="home-attendees-info-name">{data.name}</div>
          <div className="home-attendees-info-number">{data.number}</div>
          <div className="home-attendees-info-deleteIcon" onClick={() => this.showOnDeleteModal(index)}/>
        </div>
      )
    })

    return renderAttendees
  }

  showOnDeleteModal(index) {
    let onDeleteDict = {
      text: 'Delete?',
      index: index,
      function: this.onDelete,
    }

    this.props.setModal('show', 'DeleteAttendeeModal', onDeleteDict)
  }

  onDelete(index) {
    let attendeesData = Object.assign([], this.state.attendeesData)
    attendeesData.splice(index, 1)
    this.setState({attendeesData: attendeesData},() => {
      localStorage.setItem('attendees', JSON.stringify(attendeesData))
    })
  }

  onSend() {

  }

  render() {
    let date = this.state.date || 'Set Date'
    return (
      <div className="home">
        <div className="home-period">
          <div className="home-period-text" onClick={() => this.props.setModal('show', 'ChangeDateModal', this.changeDate)}>
            {date}
          </div>
        </div>
        <div className="home-attendees">
          <div className="home-attendees-headers">
            <div className="home-attendees-headers-name">Name</div>
            <div className="home-attendees-headers-number">Contact Number</div>
          </div>
          {this.renderAttendees()}
        </div>
        <div className="home-sendButton" onClick={this.onSend}>
          Send
        </div>
        <FloatingButton
          function={this.addAttendee}
        />
      </div>
    );
  }
}

export default Home;
