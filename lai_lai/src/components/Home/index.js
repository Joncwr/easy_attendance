import React, { Component } from 'react';

import AttendanceList from './AttendanceList'
import Groups from './Groups'
import Button from '../../common/Button'
import AttendeesApi from '../../services/api/attendees'
import MessageApi from '../../services/api/messaging'
import UsersApi from '../../services/api/users'
import EventsApi from '../../services/api/events'
import GroupsApi from '../../services/api/groups'

import './index.css';

class Home extends Component {
  constructor(){
    super()

    this.state = {
      attendeesData: [],
      screen: 'home',
      user: {},
      groups: [],
      currentGroup: {},
    }
    this.addAttendee=this.addAttendee.bind(this)
    this.getAttendees=this.getAttendees.bind(this)
    this.onAddAttendee=this.onAddAttendee.bind(this)
    this.onDelete=this.onDelete.bind(this)
    this.onSend=this.onSend.bind(this)
    this.changeScreen=this.changeScreen.bind(this)
    this.setEvent=this.setEvent.bind(this)
    this.getUser=this.getUser.bind(this)
    this.openSetEventModal=this.openSetEventModal.bind(this)
    this.groupActions=this.groupActions.bind(this)
  }

  componentDidMount() {
    this.getUser()

    // DELETE THISSSSS
    // this.changeScreen('groups')
  }

  addAttendee() {
    this.props.setModal('show', 'AddAttendeeModal', this.onAddAttendee)
  }

  onAddAttendee(name, number) {
    let group = Object.assign([], this.state.currentGroup)
    if (group) {
      let group_id = group.id
      let user = { name, number, group_id}
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
    else {
      this.props.setSnackbar('show', {
        text: "Please refresh the page."
      })
    }
  }

  getUser() {
    let { userId } = JSON.parse(localStorage.getItem('user'))
    UsersApi.getUser(userId)
    .then(([res]) => {
      this.setState({user: res},() => {
        if (res.groups.length > 0) {
          this.setState({groups: res.groups, currentGroup: res.groups[0]},() => {
            // Only after getting user then i can get attendees thats in the groups
            this.getAttendees()
          })
          let [groups] = res.groups
          if (groups.events) {
            this.props.setDate(groups.events.name)
          }
        }
      })
    })
    .catch(err => this.props.setSnackbar('show', {
      text: "Please refresh the page."
    }))
  }

  getAttendees() {
    AttendeesApi.getAttendees(this.state.currentGroup.id)
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
    let name = this.state.attendeesData[index].name
    let onDeleteDict = {
      text: 'Delete ' + name + '?',
      value: index,
      function: this.onDelete,
    }

    this.props.setModal('show', 'ConfirmationModal', onDeleteDict)
  }

  onDelete(index) {
    let id = this.state.attendeesData[index].id
    AttendeesApi.deleteAttendee(id)
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
    console.log(this.state.attendeesData);
    if (this.state.attendeesData.length > 0) {
      let messageDict = {
        text: 'Broadcast invitation?',
        value: {
          attendeesData: this.state.attendeesData,
          event_id: this.state.currentGroup.current_event,
        },
        function: this.broadcastMessageApi.bind(this)
      }
      this.props.setModal('show', 'ConfirmationModal', messageDict)
    }
    else {
      this.props.setSnackbar('show', {
        text: "No attendees present."
      })
    }
  }

  broadcastMessageApi(messageDict) {
    MessageApi.sendBroadcastMessage(messageDict)
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

  openSetEventModal() {
    let setEventDict = {
      text: 'event',
      function: this.setEvent
    }
    this.props.setModal('show', 'EditInputModal', setEventDict)
  }

  setEvent(method, event) {
    if (event !== '') {
      console.log(method, event);
      let user = Object.assign({}, this.state.user)
      let [group] = user.groups
      if (group.events && method === 'update') {
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
          <div className="home-header">
            <div className="home-header-period">
              <div className="home-header-period-text">
                {date}
              </div>
              <div className="home-header-period-icon" onClick={this.openSetEventModal} />
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
          <div className="home-actions home-actions--home">
            <Button
              onClick={this.onSend}
              name='Send'
              style={{
                backgroundColor: '#ffddcc',
                borderColor: '#ff884d',
                height: '50px',
                flex: 1,
                margin: '0 10px'
              }}
            />
          </div>
        </div>
      )
    }
    else if (screen === 'attendance') {
      return (
        <div className="home--mainWrapper">
          <div className="home-header">
            <div className="home-header-text">Attendance</div>
          </div>
          <AttendanceList
            currentGroup={this.state.currentGroup}
            setModal={this.props.setModal}
            attendeesData={this.state.attendeesData}
            setSnackbar={this.props.setSnackbar}
          />
        </div>
      )
    }
    else if (screen === 'groups') {
      return (
        <div className="home--mainWrapper">
          <div className="home-header">
            <div className="home-header-text">Groups</div>
          </div>
          <Groups
            user={this.state.user}
            groups={this.state.groups}
            setModal={this.props.setModal}
            setSnackbar={this.props.setSnackbar}
            onGroupAction={this.onGroupAction.bind(this)}
          />
        </div>
      )
    }
  }

  onGroupAction(method) {
    let groupAction = {}
    if (method === 'create') {
      groupAction['text'] = 'create group'
      groupAction['function'] = this.groupActions

      this.props.setModal('show', 'EditInputModal', groupAction)
    }
  }

  groupActions(method, name) {
    if (name) {
      let groupDict = {}
      if (method === 'create') {
        groupDict['user_id'] = this.state.user.id
        groupDict['group_name'] = name

        GroupsApi.createGroup(groupDict)
        .then(res => {
          console.log(res);
        })
        .catch(err => this.props.setSnackbar('show', {
          text: "Could'nt create group."
        }))
      }
    }
    else {
      this.props.setSnackbar('show', {
        text: "Error: Blank group name."
      })
    }
  }

  render() {
    let { screen } = this.state
    let selected
    if (screen === 'home') selected = ' home'
    if (screen === 'attendance') selected = ' attendance'
    if (screen === 'groups') selected = ' groups'
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
          <div className="home-tabs-groups" onClick={() => this.changeScreen('groups')}>
            <div className={"home-tabs-groups-icon" + selected} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
