import React from 'react'

import Input from '../../../common/Input'
import Button from '../../../common/Button'

import './index.css'

class EditInputModal extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      summaryUrl: '',
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
  }

  componentDidMount() {
    if (this.props.modalProps.event) {
      let summaryUrl = ''
      if (this.props.modalProps.event.summary_notes) summaryUrl = this.props.modalProps.event.summary_notes.url
      this.setState({
        name: this.props.modalProps.event.name,
        summaryUrl,
      })
    }
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    if (this.props.modalProps.text === 'event') {
      if (name === 'name') {
        if (value.length < 20) this.setState({[name]: value})
      }
      else {
        this.setState({[name]: value})
      }
    }
    else {
      this.setState({[name]: value})
    }
  }

  onSubmit(method) {
    let otherProps = this.props.modalProps.otherProps
    if (method === 'default') {
      this.props.modalProps.function(method, null, otherProps)
    }
    else {
      let eventDict = {
        name: this.state.name,
        summaryNotes: {url: this.state.summaryUrl}
      }
      this.props.modalProps.function(method, eventDict, otherProps)
    }
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
    if (text === 'edit group') {
      renderButtons.push(
        <Button
          key='Set default'
          onClick={() => this.onSubmit('default')}
          name='Set default'
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
    let style = {
      height: '50px',
      width: '100%',
      fontSize: '1.3em',
      marginBottom: '10px',
    }
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
              state={this.state.name}
              style={style}
              placeholder='Name'
            />
            <Input
              handleChange={this.handleChange}
              name='summaryUrl'
              state={this.state.summaryUrl}
              style={style}
              placeholder='Summary URL'
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
