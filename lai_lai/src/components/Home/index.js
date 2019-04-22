import React, { Component } from 'react';

import AttendanceList from './AttendanceList'
import Groups from './Groups'
import Button from '../../common/Button'
import DropDownComponent from './DropDownComponent'
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
      showDropDown: false,
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
    this.onDropDown=this.onDropDown.bind(this)
    this.openAttendanceStatistics=this.openAttendanceStatistics.bind(this)
  }

  componentDidMount() {
    this.getUser()

    // DELETE THISSSSS
    // setTimeout(() => {
    //   this.changeScreen('attendance')
    //   // this.openAttendanceStatistics()
    // }, 200)
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
          let groupIndex = 0
          res.groups.forEach((data, index) => {
            if (data.id === res.default_group) groupIndex = index
          })
          this.setState({groups: res.groups, currentGroup: res.groups[groupIndex]},() => {
            // Only after getting user then i can get attendees thats in the groups
            this.getAttendees()
          })
          let groups = res.groups
          if (groups[groupIndex].events) {
            this.props.setDate(groups[groupIndex].events.name)
          }
          else {
            this.props.setDate('')
          }
        }
        else {
          this.setState({groups: [], currentGroup: {}})
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

  broadcastMessageApi(messageDict) {
    MessageApi.sendBroadcastMessage(messageDict)
    .then(res => {
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
    if (this.state.attendeesData.length > 0 && this.props.date) {
      let messageDict = {
        text: 'Broadcast invitation?',
        value: {
          attendeesData: this.state.attendeesData,
          event_id: this.state.currentGroup.current_event,
          message: 'bible study coming up! Your'
        },
        function: this.broadcastMessageApi.bind(this)
      }
      this.props.setModal('show', 'ConfirmationModal', messageDict)
    }
    else {
      this.props.setSnackbar('show', {
        text: "No attendees/event present."
      })
    }
  }

  openSetEventModal() {
    let setEventDict = {}
    setEventDict['text'] = 'event'
    setEventDict['function'] = this.setEvent

    this.props.setModal('show', 'EditInputModal', setEventDict)
  }

  setEvent(method, event) {
    if (event !== '') {
      let user = Object.assign({}, this.state.user)
      if (user && method === 'update') {
        let updateEventDict = {
          current_event: this.state.currentGroup.current_event,
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
          group_id: this.state.currentGroup.id,
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

  onDropDown() {
    this.setState({showDropDown: !this.state.showDropDown})
  }

  onChangeGroup(groupIndex) {
    let groups = Object.assign([], this.state.user.groups)
    if (groups.length > 0) {
      this.setState({currentGroup: groups[groupIndex], showDropDown: false},() => {
        this.getAttendees()
        if (this.state.currentGroup.events) {
          this.props.setDate(this.state.currentGroup.events.name)
        }
        else {
          this.props.setDate('')
        }
      })
    }
  }

  openAttendanceStatistics() {
    let groupId = this.state.currentGroup.id
    let statisticsDict = {
      groupId,
      setSnackbar: this.props.setSnackbar
    }
    this.props.setModal('show', 'AttendanceStatisticsModal', statisticsDict)
  }

  renderDropDown() {
    if (this.state.showDropDown) {
      return  <DropDownComponent
                onChangeGroup={this.onChangeGroup.bind(this)}
                user={this.state.user}
              />
    }
  }

  renderScreen() {
    let { screen } = this.state
    let date = this.props.date || 'Create New Event'
    let groupName = this.state.currentGroup.group_name || 'Please create a group.'
    if (screen === 'home') {
      return (
        <div className="home--mainWrapper">
          <div className="home-header">
            <div className="home-header-group">
              <div className="home-header-group-text">{groupName}</div>
              <div className="home-header-group-icon" onClick={this.onDropDown}/>
            </div>
          </div>
          <div className="home-attendees">
            {this.renderDropDown()}
            <div className="home-attendees-event">
              <div className="home-attendees-event-text">
                {date}
              </div>
              <div className="home-attendees-event-icon" onClick={this.openSetEventModal} />
            </div>
            <div className="home-attendees-headers">
              <div className="home-attendees-headers-name">Name</div>
              <div className="home-attendees-headers-number">Contact Number</div>
              <div className="home-attendees-headers-number-add" onClick={this.addAttendee} />
            </div>
            {this.renderAttendees()}
          </div>
          {this.renderBroadcastButton()}
        </div>
      )
    }
    else if (screen === 'attendance') {
      return (
        <div className="home--mainWrapper">
          <div className="home-header">
            <div className="home-header-text home-header-text--attendance">Attendance</div>
            <div className="home-header-text-icon--attendance" onClick={this.openAttendanceStatistics}/>
          </div>
          <AttendanceList
            currentGroup={this.state.currentGroup}
            user={this.state.user}
            setModal={this.props.setModal}
            attendeesData={this.state.attendeesData}
            setSnackbar={this.props.setSnackbar}
            getUser={this.getUser}
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

  renderBroadcastButton() {
    let currentGroup = Object.assign({}, this.state.currentGroup)
    if (currentGroup.events) {
      if (!currentGroup.events.closed) {
        return (
          <div className="home-actions home-actions--home">
            <Button
              onClick={this.onSend}
              disabled={true}
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
        )
      }
    }
  }

  onGroupAction(method, groupId) {
    let groupAction = {}
    if (method === 'create') {
      groupAction['text'] = 'create group'
      groupAction['function'] = this.groupActions

      this.props.setModal('show', 'EditInputModal', groupAction)
    }
    if (method === 'edit') {
      groupAction['text'] = 'edit group'
      groupAction['function'] = this.groupActions
      groupAction['otherProps'] = groupId

      this.props.setModal('show', 'EditInputModal', groupAction)
    }
    if (method === 'delete') {
      groupAction['text'] = 'Delete Group?'
      groupAction['value'] = groupId
      groupAction['source'] = 'groupActions'
      groupAction['method'] = 'delete'
      groupAction['function'] = this.groupActions

      this.props.setModal('show', 'ConfirmationModal', groupAction)
    }
  }

  groupActions(method, name, otherProps) {
    if (method === 'default') {
      let defaultGroupDict = {
        user_id: this.state.user.id,
        group_id: otherProps
      }

      UsersApi.setDefaultGroup(defaultGroupDict)
      .then(res => {
        this.getUser()
      })
      .catch(err => this.props.setSnackbar('show', {
        text: "Could'nt set default group."
      }))
    }
    else if (name) {
      let groupDict = {}
      if (method === 'create') {
        groupDict['user_id'] = this.state.user.id
        groupDict['group_name'] = name

        GroupsApi.createGroup(groupDict)
        .then(res => {
          this.getUser()
        })
        .catch(err => this.props.setSnackbar('show', {
          text: "Could'nt create group."
        }))
      }
      else if (method === 'update') {
        groupDict['group_id'] = otherProps
        groupDict['group_name'] = name

        GroupsApi.editGroup(groupDict)
        .then(res => {
          this.getUser()
        })
        .catch(err => this.props.setSnackbar('show', {
          text: "Could'nt edit group."
        }))
      }
      else if (method === 'delete') {
        let groupId = otherProps

        GroupsApi.deleteGroup(groupId)
        .then(res => {
          this.getUser()
        })
        .catch(err => this.props.setSnackbar('show', {
          text: "Could'nt delete group."
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
