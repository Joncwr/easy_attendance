import React from 'react'
import queryString from 'query-string'
import validator from 'validator'

import Input from '../../common/Input'
import Button from '../../common/Button'
import PublicApi from '../../services/api/publicapi'

import './index.css'

class Registation extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      email: '',
      number: '',
      countryCode: '+65',
      hasRequested: false,
      groupId: '',
    }
    this.onPress=this.onPress.bind(this)
    this.handleChange=this.handleChange.bind(this)
  }

  componentDidMount() {
    let { groupId } = queryString.parse(window.location.search);
    this.setState({groupId})
  }

  joinMessagingGroup() {
    window.open('https://wa.me/14155238886/?text=join%20chief-while')
  }

  onPress() {
    if (this.state.name !== '' && this.state.number !== '' && this.state.groupId) {
      let requestAddAttendeeDict = {
        name: this.state.name,
        number: this.state.countryCode + this.state.number,
        email: this.state.email
      }
      PublicApi.requestAddAttendee(this.state.groupId, requestAddAttendeeDict)
      .then(res => {
        this.setState({hasRequested: true})
      })
      .catch(err => {
        this.props.setSnackbar('show', {
          text: 'Please try again.'
        })
      })
    }
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    if (name === 'number') {
      if (validator.isNumeric(value) && validator.isLength(value, {min: 0, max: 8})) {
        this.setState({[name]: value})
      }
    }
    else {
      if (validator.isLength(value, {min: 0, max: 100})) {
        this.setState({[name]: value})
      }
    }
  }

  renderScreen() {
    let ccDisabled = true
    let style = {
      marginBottom: '10px',
      height: '55px',
      fontSize: '1.2em',
      width: '100%',
    }
    let ccStyle = {
      height: '55px',
      marginRight: '5px',
      width: '100px',
    }
    if (ccDisabled) ccStyle['backgroundColor'] = '#ffd9b3'
    let numberStyle = {
      marginBottom: '10px',
      height: '55px',
      fontSize: '1.2em',
      flex: 1,
    }
    if (this.state.hasRequested) {
      return (
        <div className="registration-container-request">
          <div className="registration-container-request-image" />
          <div className="registration-container-request-text">
            Thank you for taking the time to register!
          </div>
          <div className="registration-container-request-text subtext">
            Please click on the link below and click send when whatsapp opens to join our twilio sandbox!
          </div>
          <div className="registration-container-request-actions">
            <Button
              key='Create'
              onClick={this.joinMessagingGroup}
              name='Link'
              style={{
                backgroundColor: '#e6f7ff',
                borderColor: '#80d4ff',
                height: '45px',
                margin: '0 15px'
              }}
            />
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="registration-container-input">
            <Input
              handleChange={this.handleChange}
              name='name'
              state={this.state.name}
              style={style}
              placeholder='Name'
            />
            <div className="registration-container-input-number">
              <Input
                handleChange={this.handleChange}
                name='countryCode'
                state={this.state.countryCode}
                style={ccStyle}
                placeholder='CC'
                readOnly={true}
              />
              <Input
                handleChange={this.handleChange}
                name='number'
                state={this.state.number}
                style={numberStyle}
                placeholder='Number'
              />
            </div>
            <Input
              handleChange={this.handleChange}
              name='email'
              state={this.state.email}
              style={style}
              placeholder='Email (Optional)'
            />
          </div>
          <div className="registration-actions">
            <div className="registration-actions-container" onClick={this.onPress}>
              <div className="registration-actions-container-icon" />
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="registration">
        <div className="registration-container">
          <div className="registration-container-header">Registation</div>
          {this.renderScreen()}
        </div>
      </div>
    )
  }
}

export default Registation
