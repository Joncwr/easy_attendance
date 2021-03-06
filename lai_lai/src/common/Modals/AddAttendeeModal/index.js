import React from 'react'

import Input from '../../../common/Input'

import './index.css'

class AddAttendeeModal extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      number: '',
      email: '',
      telegram: '',
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    this.setState({[name]: value})
  }

  onSubmit() {
    let addAttendeeDict = {
      name: this.state.name,
      number: this.state.number,
      email: this.state.email,
      telegram: this.state.telegram
    }
    this.props.modalProps(addAttendeeDict)
    this.props.setModal('hide')
  }

  render() {
    let style = {
      height: '50px',
      width: '100%',
      fontSize: '1.3em',
      marginBottom: '10px',
    }
    return (
      <div className="addAttendeeModal">
        <div className="addAttendeeModal-header">Add Attendee</div>
        <div className="addAttendeeModal-input">
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
        <div className="addAttendeeModal-button" onClick={this.onSubmit}>
          Add
        </div>
      </div>
    )
  }
}

export default AddAttendeeModal
