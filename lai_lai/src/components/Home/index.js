import React, { Component } from 'react';
import axios from 'axios'

import FloatingButton from '../../common/FloatingButton'
import AttendanceList from './AttendanceList'
import AttendeesApi from '../../services/api/attendees'
import MessageApi from '../../services/api/messaging'

import './index.css';

class Home extends Component {
  constructor(){
    super()

    this.state = {
      attendeesData: [],
      screen: 'home',
    }
    this.addAttendee=this.addAttendee.bind(this)
    this.getAttendees=this.getAttendees.bind(this)
    this.onAddAttendee=this.onAddAttendee.bind(this)
    this.onDelete=this.onDelete.bind(this)
    this.onSend=this.onSend.bind(this)
    this.changeScreen=this.changeScreen.bind(this)
  }

  addAttendee() {
    this.props.setModal('show', 'AddAttendeeModal', this.onAddAttendee)
  }

  onAddAttendee(name, number) {
    let user = { name, number }
    AttendeesApi.addAttendee(user)
    .then(res => {
      this.props.setSnackbar('show', {
        text: "User Added."
      })
      this.getAttendees()
    })
    .catch(err => this.props.setSnackbar('show', {
      text: "Could'nt add user."
    }))
  }

  componentDidMount() {
    this.getAttendees()
  }

  getAttendees() {
    AttendeesApi.getAttendees()
    .then(res => {
      this.setState({attendeesData: res})
    })
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
      value: index,
      function: this.onDelete,
    }

    this.props.setModal('show', 'ConfirmationModal', onDeleteDict)
  }

  onDelete(index) {
    let name = this.state.attendeesData[index].name
    AttendeesApi.deleteAttendee(name)
    .then(res => {
      this.props.setSnackbar('show', {
        text: "User deleted."
      })
      this.getAttendees()
    })
    .catch(err => this.props.setSnackbar('show', {
      text: "Could'nt delete user."
    }))
  }

  onSend() {
    MessageApi.sendBroadcastMessage(this.state.attendeesData)
    .then(res => {
      console.log(res);
      this.props.setSnackbar('show', {
        text: "Message broadcasted."
      })
    })
    .catch(err => this.props.setSnackbar('show', {
      text: "Could'nt broadcast message."
    }))
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
              <div className="home-attendees-headers-number-add" onClick={this.addAttendee} />
            </div>
            {this.renderAttendees()}
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
                  setModal={this.props.setModal}
                  attendeesData={this.state.attendeesData}
                  setSnackbar={this.props.setSnackbar}
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
