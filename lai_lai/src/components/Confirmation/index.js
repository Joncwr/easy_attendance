import React from 'react'
import queryString from 'query-string'
import Lottie from 'react-lottie';

import Button from '../../common/Button'
import CheckBox from '../../common/CheckBox'
import TextField from '../../common/TextField'
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
      isStopped: false,
      isPaused: false,
      checkbox: [],
      eventOptions: [],
    }
    this.onPress=this.onPress.bind(this)
    this.setCheckbox=this.setCheckbox.bind(this)
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
        let eventOptions = []
        let checkbox = []
        let schema = res.schema
        if (schema) {
          schema.forEach(data => {
            let extraFields
            if (data.extraFields) {
              if (data.type === 'multi' || data.type === 'single') {
                if (data.extraFields.length > 0) {
                  extraFields = []
                  data.extraFields.forEach(data => {
                    extraFields.push({
                      name: data,
                      value: false,
                    })
                  })
                }
              }
              else if (data.type === 'comments') {
                extraFields = []
                extraFields.push({
                  name: data.extraFields,
                  comment: '',
                })
              }
            }
            eventOptions.push({
              fieldName: data.fieldName,
              fieldType: data.fieldType,
              type: data.type,
              value: false,
              extraFields: extraFields,
              tags: ' - ',
            })
            checkbox.push('blank')
          })
        }
        this.setState({event: res.name, eventClosed: res.closed, eventOptions, checkbox})
      })
      .catch(err => console.log(err))
    })
  }

  handleChange(event, index, eventOptionsIndex) {
    let name = event.target.name
    let value = event.target.value
    let eventOptions = Object.assign([], this.state.eventOptions)

    if (name === 'comments') {
      if (value.length < 35) {
        eventOptions[eventOptionsIndex].extraFields[index].comment = value
        this.setState({eventOptions})
      }
    }
  }

  onPress(status) {
    let eventOptions
    if (this.state.eventOptions.length > 0) {
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

  renderOptions(options) {
    if (options) {
      let eventOptions = Object.assign([], this.state.eventOptions)
      if (eventOptions.length > 0) {
        let renderOptions = []
        eventOptions.forEach((data, index) => {
          let { fieldName, fieldType, extraFields, type } = data
          let extraFieldsArr = []
          if (extraFields) {
            extraFieldsArr = extraFields
          }
          if (fieldType === 'boolean') {
            renderOptions.push(
              <div className="confirmation-content-info-options-container" key={index}>
                <div className="confirmation-content-info-options-container-text">{fieldName}</div>
                <div className="confirmation-content-info-options-container-checkBox">
                  <div className="confirmation-content-info-options-container-checkBox-container">
                    <CheckBox
                      setCheckbox={this.setCheckbox}
                      checkbox={data.value}
                      index={index}
                    />
                  </div>
                </div>
              </div>,
              <div className={"confirmation-content-info-options-container-extraFields " + data.value} key={'extraFields' + index}>
                {this.renderExtraFields(type, extraFieldsArr, index)}
              </div>
            )
          }
        })
        return (
          <div className="confirmation-content-info-options">
            {renderOptions}
          </div>
        )
      }
    }
  }

  renderExtraFields(type, extraFields, eventOptionsIndex) {
    if (extraFields.length > 0) {
      let renderExtraFields = []

      extraFields.forEach((data,index) => {
      if (type === 'multi' || type === 'single') {
        renderExtraFields.push(
          <div className="confirmation-content-info-options-container-extraFields-field" key={index}>
            <div className="confirmation-content-info-options-container-extraFields-field-text">
              {data.name}
            </div>
            <div className="confirmation-content-info-options-container-extraFields-field-text-checkbox">
              <CheckBox
                setCheckbox={this.setCheckbox}
                checkbox={data.value}
                index={index}
                extraFields={true}
                eventOptionsIndex={eventOptionsIndex}
              />
            </div>
          </div>
        )
      }

      else if (type === 'comments') {
        let placeholder = `Enter for ${data.name}`
        renderExtraFields.push(
          <div className="confirmation-content-info-options-container-extraFields-comments" key={index}>
            <div className="confirmation-content-info-options-container-extraFields-comments-header">
              {data.name}:
            </div>
            <TextField
              handleChange={e => this.handleChange(e, index, eventOptionsIndex)}
              name={'comments'}
              state={data.comment}
              placeholder={placeholder}
              style={{
                height: '40px',
              }}
            />
          </div>
        )
      }
    })

      return renderExtraFields
    }
  }

  setCheckbox(index, method, options) {
    let eventOptions = Object.assign([],this.state.eventOptions)
    if (method === 'extraFields') {
      if (!eventOptions[index].extraFields[options].value) {
        eventOptions[index].extraFields[options].value = true
      }
      else {
        eventOptions[index].extraFields[options].value = false
      }
    }
    else {
      if (!eventOptions[index].value) {
        eventOptions[index].value = true
      }
      else {
        eventOptions[index].value = false
      }
    }
    this.setState({eventOptions})
  }

  renderActions(actions) {
    if (actions) {
      return (
        <div className='confirmation-actions-container'>
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
      )
    }
  }

  renderText(name) {
    return (
      <div>
        Hai <span style={{fontWeight: '700', color: '#ff8000'}}>{name}</span>, will you be joining us for the next bible study dated above?
      </div>
    )
  }

  renderScreen(event,name) {
    let text
    let animation
    let actions = false
    let messageStatus = 'done'
    let options = false
    if (this.state.eventClosed) {
      text = "I'm sorry, this event has ended."
      animation = require('./animation_sad_cross.json')
    }
    else {
      if (this.state.name) {
        if (!this.state.hasAnswered) {
          text = this.renderText(name)
          actions = true
          animation = require('./animation_sad_cross.json')
          messageStatus = ''
          options = true
        }
        else {
          text = "Thanks! Your attendance has been saved!"
          animation = require('./animation_happy_cross.json')
        }
      }
      else {
        text = "Hai, was not able to get your name, please open the link from whatsapp again. If this continues, please contact your host."
        animation = require('./animation_sad_cross.json')
      }
    }

    return (
      <div className="confirmation--mainWrapper">
        <div className="confirmation-content">
          <div className="confirmation-content-graphic">
            <Lottie
              options={
                {
                  loop: true,
                  autoplay: true,
                  animationData: animation,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet'
                  }
                }
              }
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
          </div>
          <div className="confirmation-content-info">
          <div className="confirmation-content-info-message">
            <div className={"confirmation-content-info-message-text " + messageStatus} >
              {text}
            </div>
          </div>
          {this.renderOptions(options)}
          </div>
        </div>
        <div className="confirmation-actions">
          {this.renderActions(actions)}
        </div>
      </div>
    )
  }

  render() {
    console.log(this.state);
    let event = (this.state.event) ? this.state.event : 'No event name'
    let name = this.state.name
    return (
      <div className="confirmation">
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
