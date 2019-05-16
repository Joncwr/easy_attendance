import React from 'react'

import AttendeesApi from '../../../services/api/attendees'
import MessageApi from '../../../services/api/messaging'
import AttendanceApi from '../../../services/api/attendance'
import EventsApi from '../../../services/api/events'
import AttendanceStatsDrawer from './AttendanceStatsDrawer'
import ExtraOptionsHelper from '../../../helpers/ExtraOptionsHelper'

import './index.css'

class AttendanceList extends React.Component {
  constructor(){
    super()

    this.state = {
      attendees: [],
      confirmed: 0,
      declined: 0,
      uncertain: 0,
      isDrawerOpen: 'blank',
      extraOptions: [],
      drawerDisplay: 'none',
    }
    this.getAttendees=this.getAttendees.bind(this)
    this.renderAttendees=this.renderAttendees.bind(this)
    this.onPress=this.onPress.bind(this)
    this.openEventsModal=this.openEventsModal.bind(this)
    this.getExtraOptions=this.getExtraOptions.bind(this)
  }

  componentDidMount() {
    this.getAttendees()

    // DELETE!!!
    // this.openEventsOptionsModal()
    // setTimeout(() => {
    //   this.openSummaryModal()
    // }, 500)
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
                data['eventOptions'] = attendance.conditions
                data['tags'] = attendance.tags
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
            this.setState({attendees: attendees, confirmed: confirmed, declined: declined, uncertain: uncertain},() => this.getExtraOptions(attendees))
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

  getExtraOptions(attendees) {
    let { currentGroup } = this.props
    if (currentGroup.events) {
      let eventSchema = currentGroup.events.event_schema
      if (eventSchema) {
        let extraOptions = ExtraOptionsHelper.getExtraOptions(eventSchema, attendees)
        this.setState({extraOptions})
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

  openEditAttendeesModal(attendee) {
    let { currentGroup } = this.props
    if (currentGroup.events) {
      let editAttendanceDict = {
        attendee,
        tags: this.props.user.tags || [],
        eventId: currentGroup.events.id,
        setSnackbar: this.props.setSnackbar,
        getUser: this.props.getUser,
      }

      this.props.setModal('show', 'EditAttendanceModal', editAttendanceDict)
    }
  }

  openTagsModal() {
    if (this.props.user) {
      let tagsDict = {
        tags: this.props.user.tags || [],
        setSnackbar: this.props.setSnackbar,
        userId: this.props.user.id,
        getUser: this.props.getUser,
      }
      this.props.setModal('show', 'EditTagsModal', tagsDict)
    }
  }

  openEventsOptionsModal() {
    if (this.props.currentGroup) {
      let eventsOptionsDict = {
        event: this.props.currentGroup.events,
        setSnackbar: this.props.setSnackbar,
      }
      this.props.setModal('show', 'MoreEventOptionsModal', eventsOptionsDict)
    }
  }

  openSummaryModal() {
    let { confirmed, declined, uncertain } = this.state
    let attendanceSummary = { confirmed, declined, uncertain }
    let summaryModalDict = {
      attendanceSummary,
      extraOptions: this.state.extraOptions,
      attendees: this.state.attendees,
      setSnackbar: this.props.setSnackbar,
    }
    this.props.setModal('show', 'SummaryModal', summaryModalDict)
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

  setDrawer(state) {
    if (state || this.state.isDrawerOpen === 'blank') {
      this.setState({isDrawerOpen: true, drawerDisplay: 'flex'})
    }
    else {
      this.setState({isDrawerOpen: false}, () => {
        setTimeout(() => {
          this.setState({drawerDisplay: 'none'})
        }, 290)
      })
    }
  }

  onWhatsapp(number, method) {
    if (method === 'telegramSong') {
      if (this.props.currentGroup.events) {
        let { id } = this.props.currentGroup.events
        let whatsappUrl = 'https://wa.me/' + number + '?text=https://t.me/BibleStudySG_Bot?start=sngdedfor' + id
        window.open(whatsappUrl)
      }
    }
    else {
      let whatsappUrl = 'https://wa.me/' + number
      window.open(whatsappUrl)
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
          <div className="attendanceList-contact-name" onClick={() => this.openEditAttendeesModal(data)}>
            {data.name}
          </div>
          <div className="attendanceList-contact-status" onClick={() => this.openEditAttendeesModal(data)}>
            {data.status}
          </div>
          {this.renderActions(data.name, data.number)}
        </div>
      )
    })

    return renderAttendees
  }

  renderActions(name, number) {
    let currentGroup = Object.assign({}, this.props.currentGroup)
    if (currentGroup.events) {
      if (!currentGroup.events.closed) {
        return (
          <div className="attendanceList-contact-actions">
            <div className="attendanceList-contact-actions-telegramSong" onClick={() => this.onWhatsapp(number, 'telegramSong')}>
              <div className="attendanceList-contact-actions-telegramSong-icon" />
            </div>
            <div className="attendanceList-contact-actions-whatsapp" onClick={() => this.onWhatsapp(number)}>
              <div className="attendanceList-contact-actions-whatsapp-icon" />
            </div>
            <div className="attendanceList-contact-actions-message" onClick={() => this.onPress(name)}>
              <div className="attendanceList-contact-actions-message-icon" />
            </div>
          </div>
        )
      }
    }
  }

  render() {
    let { confirmed, declined, uncertain, isDrawerOpen, extraOptions, drawerDisplay } = this.state
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
        <AttendanceStatsDrawer
          confirmed={confirmed}
          declined={declined}
          uncertain={uncertain}
          isDrawerOpen={isDrawerOpen}
          extraOptions={extraOptions}
          drawerDisplay={drawerDisplay}
          setDrawer={this.setDrawer.bind(this)}
        />
        <div className="attendanceList-options">
          <div className="attendanceList-options-tags">
            <div className="attendanceList-options-tags-icon" onClick={this.openTagsModal.bind(this)}/>
          </div>
          <div className="attendanceList-options-save">
            <div className={"attendanceList-options-save-icon " + isEventClosed} onClick={() => this.openEventStatusModal(isEventClosed)}/>
          </div>
          <div className="attendanceList-options-extraOptions">
            <div className="attendanceList-options-extraOptions-icon" onClick={this.openEventsOptionsModal.bind(this)}/>
          </div>
          {(extraOptions.length > 0) ?
            <div className="attendanceList-options-summary">
              <div className="attendanceList-options-summary-icon" onClick={this.openSummaryModal.bind(this)}/>
            </div>
          :
            <div className="attendanceList-options-summary">
              <div className="attendanceList-options-summary-icon disabled"/>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default AttendanceList
