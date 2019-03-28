import React, { Component } from 'react';
import axios from 'axios'

import FloatingButton from '../../common/FloatingButton'
import AttendanceList from './AttendanceList'

import './index.css';

class Home extends Component {
  constructor(){
    super()

    this.state = {
      attendeesData: [],
      screen: 'home',
    }
    this.addAttendee=this.addAttendee.bind(this)
    this.onAddAttendee=this.onAddAttendee.bind(this)
    this.onDelete=this.onDelete.bind(this)
    this.onSend=this.onSend.bind(this)
    this.changeScreen=this.changeScreen.bind(this)
  }

  addAttendee() {
    this.props.setModal('show', 'AddAttendeeModal', this.onAddAttendee)
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
    if (attendeesData) this.setState({attendeesData: attendeesData})
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
    axios.post('http://localhost:3001/whatsapp', {
      attendees: this.state.attendeesData
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  changeScreen(screen) {
    this.setState({screen: screen})
  }

  renderScreen() {
    let { screen } = this.state
    let date = this.props.date || 'Set Date'
    if (screen === 'home') {
      return (
        <div className="home--mainWrapper">
          <div className="home-period">
            <div className="home-period-text" onClick={() => this.props.setModal('show', 'ChangeDateModal', this.props.changeDate)}>
              {date}
            </div>
          </div>
          <div className="home-attendees">
            <div className="home-attendees-headers">
              <div className="home-attendees-headers-name">Name</div>
              <div className="home-attendees-headers-number">Contact Number</div>
            </div>
            {this.renderAttendees()}
            <FloatingButton
              function={this.addAttendee}
            />
          </div>
          <div className="home-sendButton" onClick={this.onSend}>
            Send
          </div>
        </div>
      )
    }
    else if (screen === 'attendance') {
        return (
          <div className="home--mainWrapper">
            <div className="home-attendance">
              <div className="home-attendance-list">
                <AttendanceList
                />
              </div>
            </div>
          </div>
        )
    }
  }

  render() {
    let { screen } = this.state
    let selected
    if (screen === 'home') selected = ' home'
    if (screen === 'attendance') selected = ' attendance'
    return (
      <div className="home">
        {this.renderScreen()}
        <div className="home-tabs">
          <div className="home-tabs-home" onClick={() => this.changeScreen('home')}>
            <div className={"home-tabs-home-icon" + selected} />
          </div>
          <div className="home-tabs-attendance" onClick={() => this.changeScreen('attendance')}>
            <div className={"home-tabs-attendance-icon" + selected} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
