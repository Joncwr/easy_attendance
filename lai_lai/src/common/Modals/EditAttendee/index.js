import React from 'react'

import Input from '../../../common/Input'
import AttendeesApi from '../../../services/api/attendees'

import './index.css'

class EditAttendee extends React.Component {
  constructor(){
    super()

    this.state = {
      id: '',
      name: '',
      number: '',
      email: '',
      telegram: '',
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
  }

  componentDidMount() {
    let { id, name, number, email , telegram_id } = this.props.modalProps.attendee
    this.setState({
      id,
      name,
      number,
      email: email || '',
      telegram: telegram_id || ''
    })
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    this.setState({[name]: value})
  }

  onSubmit() {
    let addAttendeeDict = {
      id: this.state.id,
      name: this.state.name,
      number: this.state.number,
      email: this.state.email,
      telegram: this.state.telegram
    }
    AttendeesApi.editAttendee(addAttendeeDict)
    .then(res => {
      this.props.modalProps.setSnackbar('show', {
        text: 'Successfully changed details.'
      })
      this.props.setModal('hide')
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: 'Error. Please try reload and try again.'
    }))
  }

  render() {
    let style = {
      height: '50px',
      width: '100%',
      fontSize: '1.3em',
      marginBottom: '10px',
    }
    return (
      <div className="editAttendee">
        <div className="editAttendee-header">Add Attendee</div>
        <div className="editAttendee-input">
          <Input
            handleChange={this.handleChange}
            name='name'
            state={this.state.name}
            style={style}
            placeholder='Name'
          />
          <Input
            handleChange={this.handleChange}
            name='number'
            style={style}
            state={this.state.number}
            placeholder='Number'
          />
          <Input
            handleChange={this.handleChange}
            name='email'
            style={style}
            state={this.state.email}
            placeholder='Email'
          />
          <Input
            handleChange={this.handleChange}
            name='telegram'
            style={style}
            state={this.state.telegram}
            placeholder='Telegram'
          />
        </div>
        <div className="editAttendee-button" onClick={this.onSubmit}>
          Update
        </div>
      </div>
    )
  }
}

export default EditAttendee
