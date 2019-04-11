import React from 'react'
import queryString from 'query-string'
import Lottie from 'react-lottie';

import Button from '../../common/Button'
import RadioButton from '../../common/RadioButton'
import LoadingOverlay from '../../common/LoadingOverlay'
import PublicApi from '../../services/api/publicapi'

import './index.css'

class Confirmation extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      attendeeId: '',
      event: '',
      eventId: '',
      eventSchema: {},
      eventClosed: 'blank',
      hasAnswered: false,
      isLoading: false,
      isStopped: false,
      isPaused: false,
      radioButton: 'blank',
      eventOptions: {},
    }
    this.onPress=this.onPress.bind(this)
  }

  componentDidMount() {
    let query = queryString.parse(window.location.search);
    if (query.attendee_id) this.setState({attendeeId: query.attendee_id, eventId: query.event_id},() => {
      PublicApi.getAttendee(query.attendee_id)
      .then(res => {
        this.setState({name: res})
      })
      .catch(err => console.log(err))

      PublicApi.getEvent(query.event_id)
      .then((res) => {
        let eventOptions = {}
        if (res.schema) {
          eventOptions['fieldName'] = res.schema.fieldName
          eventOptions['fieldType'] = res.schema.fieldType
          eventOptions['type'] = res.schema.type
          eventOptions['value'] = false
          if (res.schema.comments) eventOptions['comments'] = ' - '
        }
        this.setState({event: res.name, eventClosed: res.closed, eventOptions})
      })
      .catch(err => console.log(err))
    })
  }

  onPress(status) {
    let eventOptions
    if (this.state.eventOptions) {
      eventOptions = this.state.eventOptions
    }
    let attendanceDict = {
      attendee_id: this.state.attendeeId,
      event_id: this.state.eventId,
      status,
      eventOptions
    }

    PublicApi.postAttendance(attendanceDict)
    .then((res) => {
      this.props.setSnackbar('show', {
        text: "Attendance submitted."
      })
      this.setState({hasAnswered: true})
    })
    .catch(err => this.props.setSnackbar('show', {
      text: "Could'nt submit attendance."
    }))
  }

  renderOptions() {
    let eventOptions = Object.assign({}, this.state.eventOptions)
    let { fieldType, fieldName, type, comments } = eventOptions

    if (type === 'single' && fieldType === 'boolean' && !comments) {
      return (
        <div className="confirmation-options">
          <div className="confirmation-options-text">{fieldName}</div>
          <div className="confirmation-options-radioButton">
            <div className="confirmation-options-radioButton-container">
              <RadioButton
                setRadioButton={this.setRadioButton.bind(this)}
                radioButton={this.state.radioButton}
              />
            </div>
          </div>
        </div>
      )
    }
  }

  setRadioButton() {
    let eventOptions = Object.assign({}, this.state.eventOptions)
    eventOptions['value'] = false
    if (this.state.radioButton === 'blank') {
      eventOptions['value'] = true
      this.setState({radioButton: true, eventOptions})
    }
    else {
      eventOptions['value'] = !this.state.radioButton
      this.setState({radioButton: !this.state.radioButton, eventOptions})
    }
  }

  renderScreen(event,name) {
    if (this.state.eventClosed) {
      return (
        <div className="confirmation--mainWrapper">
          <div className="confirmation-content">
            <Lottie
              options={
                {
                  loop: true,
                  autoplay: true,
                  animationData: require('./animation_sad_cross.json'),
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet'
                  }
                }
              }
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
            <div className="confirmation-content-message">
              <div className="confirmation-content-message-text done">
                I'm sorry, this event has ended.
              </div>
            </div>
          </div>
          <div className="confirmation-actions">
          </div>
        </div>
      )
    }
    else {
      if (this.state.name && !this.state.hasAnswered) {
        return (
          <div className="confirmation--mainWrapper">
            <div className="confirmation-content">
              <div className="confirmation-content-graphic">
                <Lottie
                  options={
                    {
                      loop: true,
                      autoplay: true,
                      animationData: require('./animation_sad_cross.json'),
                      rendererSettings: {
                        preserveAspectRatio: 'xMidYMid meet'
                      }
                    }
                  }
                  isStopped={this.state.isStopped}
                  isPaused={this.state.isPaused}/>
              </div>
              <div className="confirmation-content-message">
                <div className="confirmation-content-message-text">
                  Hai <span style={{fontWeight: '700', color: '#ff8000'}}>{name}</span>, will you be joining us for the next bible study dated above?
                </div>
              </div>
            </div>
            {this.renderOptions()}
            <div className="confirmation-actions">
              <Button
                onClick={() => this.onPress(false)}
                name='Decline'
                style={{
                  backgroundColor: '#ffd1b3',
                  borderColor: '#ff8533',
                  margin: '0 10px',
                  flex: 1,
                }}
              />
              <Button
                onClick={() => this.onPress(true)}
                name='Confirm'
                style={{
                  backgroundColor: '#e6ffe6',
                  borderColor: '#4feb8b',
                  margin: '0 10px',
                  flex: 1,
                }}
              />
            </div>
          </div>
        )
      }
      else if (this.state.name && this.state.hasAnswered) {
        return (
          <div className="confirmation--mainWrapper">
            <div className="confirmation-content">
              <div className="confirmation-content-graphic">
                <Lottie
                  options={
                    {
                      loop: true,
                      autoplay: true,
                      animationData: require('./animation_happy_cross.json'),
                      rendererSettings: {
                        preserveAspectRatio: 'xMidYMid meet'
                      }
                    }
                  }
                  isStopped={this.state.isStopped}
                  isPaused={this.state.isPaused}/>
              </div>
              <div className="confirmation-content-message">
                <div className="confirmation-content-message-text done">
                  Thanks! Your attendance has been saved!
                </div>
              </div>
            </div>
            <div className="confirmation-actions">
            </div>
          </div>
        )
      }
      else if (!this.state.name) {
        return (
          <div className="confirmation--mainWrapper">
            <div className="confirmation-content">
              <Lottie
                options={
                  {
                    loop: true,
                    autoplay: true,
                    animationData: require('./animation_sad_cross.json'),
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid meet'
                    }
                  }
                }
                isStopped={this.state.isStopped}
                isPaused={this.state.isPaused}/>
              <div className="confirmation-content-message">
                <div className="confirmation-content-message-text error">
                  Hai, was not able to get your name, please open the link from whatsapp again. If this continues, please contact your host.
                </div>
              </div>
            </div>
            <div className="confirmation-actions">
            </div>
          </div>
        )
      }
    }
  }

  render() {
    let event = (this.state.event) ? this.state.event : 'No event name'
    let name = this.state.name
    return (
      <div className="confirmation">
        <LoadingOverlay
          isLoading={this.state.isLoading}
        />
        <div className="confirmation-header">
          <div className="confirmation-header-text">
            {event}
          </div>
        </div>
        {this.renderScreen(event,name)}
      </div>
    )
  }
}

export default Confirmation
