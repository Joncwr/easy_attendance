import React from 'react'

import Input from '../../../common/Input'
import Button from '../../../common/Button'

import './index.css'

class ChangeEventModal extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    this.setState({[name]: value})
  }

  onSubmit(method) {
    this.props.modalProps(method, this.state.name)
    this.props.setModal('hide')
  }

  render() {
    return (
      <div className="changeEventModal">
        <div className="changeEventModal-input">
          <div className="changeEventModal-input-name">
            <div className="changeEventModal-input-name-header">
              Event
            </div>
            <Input
              handleChange={this.handleChange}
              name='name'
              state={this.props.period}
            />
          </div>
        </div>
        <div className="changeEventModal-actions">
          <Button
            onClick={() => this.onSubmit('create')}
            name='Create'
            style={{
              backgroundColor: '#ccffee',
              borderColor: '#33ffbb',
              height: '50px',
              flex: 1,
              margin: '0 10px'
            }}
          />
          <Button
            onClick={() => this.onSubmit('update')}
            name='Update'
            style={{
              backgroundColor: '#ffddcc',
              borderColor: '#ff884d',
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

export default ChangeEventModal
