import React from 'react'

import Input from '../../../common/Input'
import Button from '../../../common/Button'
import EventsApi from '../../../services/api/events'

import './index.css'

class EditAttendanceModal extends React.Component {
  constructor(){
    super()

    this.state = {
      message: '',
      eventMessage: '',
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
  }

  componentDidMount() {
    let { event } = this.props.modalProps
    if (event.message) this.setState({eventMessage: event.message})
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    if (value.length < 100) {
      this.setState({[name]: value})
    }
  }

  onSubmit() {
    let eventsDict = {
      eventId: this.props.modalProps.event.id,
      message: this.state.message
    }
    EventsApi.addEventMessage(eventsDict)
    .then(res => {
      this.props.modalProps.setSnackbar('show', {
        text: 'Event message set.'
      })
      this.props.setModal('hide')
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: 'Couldnt set events message.'
    }))
  }

  renderMessage() {
    let { eventMessage } = this.state
    if (eventMessage) {
      return (
        <div className="setEventsMessage-message-currentMessage">
          <div className="setEventsMessage-message-currentMessage-header">Current Message:</div>
          <div className="setEventsMessage-message-currentMessage-message">{eventMessage}</div>
        </div>
      )
    }
    else {
      return (
        <div className="setEventsMessage-message-null">
          No current event messages.
        </div>
      )
    }
  }

  render() {
    return (
      <div className="setEventsMessage">
        <div className="setEventsMessage-header">
          Set Event Message
        </div>
        <div className="setEventsMessage-message">
          {this.renderMessage()}
        </div>
        <div className="setEventsMessage-input">
          <textarea
            className='setEventsMessage-input-textarea'
            name="message"
            onChange={this.handleChange}
            value={this.state.message}
            placeholder='Please write your message here.'
          />
        </div>
        <div className="setEventsMessage-actions">
          <Button
            key='Update'
            onClick={this.onSubmit}
            name='Update'
            style={{
              backgroundColor: '#ccffee',
              borderColor: '#33ffbb',
              height: '50px',
              flex: 1,
              margin: '0 10px'
            }}
          />
        </div>
      </div>
    )
  }
}

export default EditAttendanceModal
