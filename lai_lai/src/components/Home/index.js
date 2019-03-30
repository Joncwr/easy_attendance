import React, { Component } from 'react';

import AttendanceList from './AttendanceList'
import AttendeesApi from '../../services/api/attendees'
import MessageApi from '../../services/api/messaging'
import UsersApi from '../../services/api/users'
import EventsApi from '../../services/api/events'

import './index.css';

class Home extends Component {
  constructor(){
    super()

    this.state = {
      attendeesData: [],
      screen: 'home',
      user: {},
    }
    this.addAttendee=this.addAttendee.bind(this)
    this.getAttendees=this.getAttendees.bind(this)
    this.onAddAttendee=this.onAddAttendee.bind(this)
    this.onDelete=this.onDelete.bind(this)
    this.onSend=this.onSend.bind(this)
    this.changeScreen=this.changeScreen.bind(this)
    this.setEvent=this.setEvent.bind(this)
    this.getUser=this.getUser.bind(this)
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
    this.getUser()
    this.getAttendees()
  }

  getUser() {
    let { userId } = JSON.parse(localStorage.getItem('user'))
    UsersApi.getUser(userId)
    .then(([res]) => {
      this.setState({user: res},() => {
        let [groups] = res.groups
        if (groups.events) {
          this.props.setDate(groups.events.name)
        }
      })
    })
    .catch(err => this.props.setSnackbar('show', {
      text: "Please refresh the page."
    }))
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

  setEvent(event) {
    if (event !== '') {
      let user = Object.assign({}, this.state.user)
      let [group] = user.groups
      if (group.events) {
        let updateEventDict = {
          current_event: group.current_event,
          event_name: event
        }
        EventsApi.updateEvent(updateEventDict)
        .then(res => {
          this.props.setDate(event)
          this.props.setSnackbar('show', {
            text: "Event updated."
          })
          this.getUser()
        })
        .catch(err => this.props.setSnackbar('show', {
          text: "Could'nt update event."
        }))
      }
      else {
        let createEventsDict = {
          group_id: group.id,
          event_name: event
        }
        EventsApi.createEvent(createEventsDict)
        .then(res => {
          this.props.setDate(event)
          this.props.setSnackbar('show', {
            text: "Event created."
          })
          this.getUser()
        })
        .catch(err => this.props.setSnackbar('show', {
          text: "Could'nt create event."
        }))
      }
    }
    else {
      this.props.setSnackbar('show', {
        text: "Error: Blank event name."
      })
    }
  }

  renderScreen() {
    let { screen } = this.state
    let date = this.props.date || 'Create New Event'
    if (screen === 'home') {
      return (
        <div className="home--mainWrapper">
          <div className="home-period">
            <div className="home-period-text" onClick={() => this.props.setModal('show', 'ChangeEventModal', this.setEvent)}>
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
