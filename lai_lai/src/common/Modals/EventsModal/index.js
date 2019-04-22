import React from 'react'

import EventsApi from '../../../services/api/events.js'

import './index.css'

class EventsModal extends React.Component {
  constructor(){
    super()

    this.state = {
      eventStatus: 'open',
      openEvents: [],
      closedEvents: [],
    }
    this.onEventSelect=this.onEventSelect.bind(this)
  }

  componentDidMount() {
    let groupId = this.props.modalProps.groupId || ''
    if (groupId) {
      EventsApi.getEvents(groupId)
      .then(events => {
        let openEvents = []
        let closedEvents = []
        events.forEach(data => {
          if (!data.closed) openEvents.push(data)
          else if (data.closed) closedEvents.push(data)
        })
        this.setState({openEvents, closedEvents})
      })
      .catch(err => this.props.modalProps.setSnackbar('show', {
        text: "Could'nt get events."
      }))
    }
  }

  renderEvents() {
    let eventStatus = this.state.eventStatus
    if (eventStatus === 'open') {
      let openEventsArr = Object.assign([], this.state.openEvents)
      let renderEvents = []

      openEventsArr.forEach((data,index) => {
        renderEvents.push(
          <div className="eventsModal-list-event" key={index} onClick={() => this.onEventSelect(data.id)}>
            <div className="eventsModal-list-event-text">
              {data.name}
            </div>
            <div className="eventsModal-list-event-icon" />
          </div>
        )
      })

      return renderEvents
    }
    else if (eventStatus === 'closed') {
      let closedEventsArr = Object.assign([], this.state.closedEvents)
      let renderEvents = []

      closedEventsArr.forEach((data,index) => {
        renderEvents.push(
          <div className="eventsModal-list-event" key={index} onClick={() => this.onEventSelect(data.id)}>
            <div className="eventsModal-list-event-text">
              {data.name}
            </div>
            <div className="eventsModal-list-event-icon" />
          </div>
        )
      })

      return renderEvents
    }
  }

  onEventSelect(event_id) {
    let groupId = this.props.modalProps.groupId || ''
    if (groupId) {
      let setCurrentEventDict = {
        group_id: groupId,
        event_id
      }

      EventsApi.setCurrentEvent(setCurrentEventDict)
      .then(res => {
        this.props.modalProps.getUser()
        this.props.setModal('hide')
      })
      .catch(err => this.props.modalProps.setSnackbar('show', {
        text: "Could'nt set events."
      }))
    }
  }

  render() {
    return (
      <div className="eventsModal">
        <div className="eventsModal-top">
          <div className="eventsModal-top-options">
            <div className={"eventsModal-top-options-open " + this.state.eventStatus} onClick={() => this.setState({eventStatus: 'open'})}>
              Open
            </div>
            <div className={"eventsModal-top-options-closed " + this.state.eventStatus} onClick={() => this.setState({eventStatus: 'closed'})}>
              Closed
            </div>
          </div>
        </div>
        <div className="eventsModal-list">
          {this.renderEvents()}
        </div>
        <div className="modal-bottom--default" />
      </div>
    )
  }
}

export default EventsModal
