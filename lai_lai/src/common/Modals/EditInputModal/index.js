import React from 'react'

import Input from '../../../common/Input'
import Button from '../../../common/Button'

import './index.css'

class EditInputModal extends React.Component {
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
    this.props.modalProps.function(method, this.state.name)
    this.props.setModal('hide')
  }

  renderButtons() {
    let { text } = this.props.modalProps
    let renderButtons = []
    if (text === 'event' || text === 'create group') {
      renderButtons.push(
        <Button
          key='Create'
          onClick={() => this.onSubmit('create')}
          name='Create'
          style={{
            backgroundColor: '#ffddcc',
            borderColor: '#ff884d',
            height: '50px',
            flex: 1,
            margin: '0 10px'
          }}
        />
      )
    }
    if (text === 'event' || text === 'edit group') {
      renderButtons.push(
        <Button
          key='Update'
          onClick={() => this.onSubmit('update')}
          name='Update'
          style={{
            backgroundColor: '#ccffee',
            borderColor: '#33ffbb',
            height: '50px',
            flex: 1,
            margin: '0 10px'
          }}
        />
      )
    }

    return renderButtons
  }

  render() {
    let { text } = this.props.modalProps
    return (
      <div className="editInputModal">
        <div className="editInputModal-input">
          <div className="editInputModal-input-name">
            <div className="editInputModal-input-name-header">
              {text}
            </div>
            <Input
              handleChange={this.handleChange}
              name='name'
              state={this.props.period}
            />
          </div>
        </div>
        <div className="editInputModal-actions">
          {this.renderButtons()}
        </div>
      </div>
    )
  }
}

export default EditInputModal
