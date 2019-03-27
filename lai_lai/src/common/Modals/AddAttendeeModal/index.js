import React from 'react'

import Input from '../../../common/Input'

import './index.css'

class AddAttendeeModal extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      number: '',
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
    this.props.modalProps(this.state.name, this.state.number)
    this.props.setModal('hide')
  }

  render() {
    return (
      <div className="addAttendeeModal">
        <div className="addAttendeeModal-input">
          <div className="addAttendeeModal-input-name">
            <div className="addAttendeeModal-input-name-header">
              Name
            </div>
            <Input
              handleChange={this.handleChange}
              name='name'
              state={this.props.period}
            />
          </div>
          <div className="addAttendeeModal-input-number">
            <div className="addAttendeeModal-input-number-header">
              Number
            </div>
            <Input
              handleChange={this.handleChange}
              name='number'
              state={this.props.period}
            />
          </div>
        </div>
        <div className="addAttendeeModal-button" onClick={this.onSubmit}>
          Add
        </div>
      </div>
    )
  }
}

export default AddAttendeeModal
