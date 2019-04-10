import React from 'react'

import EventsApi from '../../../services/api/events'
import Input from '../../../common/Input'
import Button from '../../../common/Button'

import './index.css'

class MoreEventOptionsModal extends React.Component {
  constructor(){
    super()

    this.state = {
      fieldName: '',
      haveSchema: false,
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
  }

  componentDidMount() {
    if (this.props.modalProps.event_schema) {
      this.setState({haveSchema: true})
    }
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    if (value.length < 10) {
      this.setState({[name]: value})
    }
  }

  onSubmit(method) {
    if (this.state.fieldName) {
      // for now we only have one type, which is just a single field and its boolean
      let fieldName = this.state.fieldName
      let eventSchema = {
        fieldName,
        type: 'single',
        fieldType: 'boolean',
        comments: false
      }
      let eventOptionsDict = {
        event_id: this.props.modalProps.id,
        eventSchema
      }

      EventsApi.setEventSchema(eventOptionsDict)
      .then(res => {
        this.props.setModal('hide')
      })
      .catch(err => this.props.setSnackbar('show', {
        text: "Could'nt set event schema."
      }))
    }
  }

  renderButtons() {
    let renderButtons = []
    renderButtons.push(
      <Button
        key='Set'
        onClick={this.onSubmit}
        name='Set'
        style={{
          backgroundColor: '#ffddcc',
          borderColor: '#ff884d',
          height: '50px',
          flex: 1,
          margin: '0 10px'
        }}
      />
    )

    return renderButtons
  }

  renderWarning() {
    if (this.state.haveSchema) {
      return <div className="moreEventOptions-warning">This event already has options, overwriting it may cause errors.</div>
    }
  }

  render() {
    return (
      <div className="moreEventOptions">
        <div className="moreEventOptions-header">
          More event options
        </div>
        <Input
          handleChange={this.handleChange}
          name='fieldName'
          state={this.state.fieldName}
        />
        {this.renderWarning()}
        <div className="moreEventOptions-actions">
          {this.renderButtons()}
        </div>
      </div>
    )
  }
}

export default MoreEventOptionsModal
