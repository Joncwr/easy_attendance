import React from 'react'

import EventsApi from '../../../services/api/events'
import TextField from '../../../common/TextField'
import Button from '../../../common/Button'

import './index.css'

class MoreEventOptionsModal extends React.Component {
  constructor(){
    super()

    this.state = {
      field: {
        name: '',
        subfields: [],
      },
      haveSchema: false,
      eventSchema: [],
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
    this.addField=this.addField.bind(this)
    this.addSubField=this.addSubField.bind(this)
    this.deleteSubfield=this.deleteSubfield.bind(this)
  }

  componentDidMount() {
    if (this.props.modalProps.event.event_schema) {
      this.setState({haveSchema: true, eventSchema: this.props.modalProps.event.event_schema})
    }
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value
    let field = Object.assign({}, this.state.field)

    if (name === 'subfield') {
      if (value.length < 15) {
        field.subfields[index] = value
        this.setState({field})
      }
    }

    else if (value.length < 15) {
      field[name] = value
      this.setState({field})
    }
  }

  onSubmit(method) {
    let eventSchema = Object.assign([], this.state.eventSchema)
    // for now we only have one type, which is just a single field and its boolean
    let eventOptionsDict = {
      event_id: this.props.modalProps.event.id,
      eventSchema
    }

    EventsApi.setEventSchema(eventOptionsDict)
    .then(res => {
      this.props.setModal('hide')
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: "Could'nt set event schema."
    }))
  }

  addField() {
    let eventSchema = Object.assign([], this.state.eventSchema)
    let field = Object.assign({}, this.state.field)
    if (eventSchema.length < 3 && field.name) {
      let subfields
      if (field.subfields.length > 0) {
        let checkSubfields = []
        field.subfields.forEach(data => {
          if (data) checkSubfields.push(data)
        })
        if (checkSubfields.length > 0) subfields = checkSubfields
      }
      eventSchema.push({
        fieldName: field.name,
        fieldType: 'boolean',
        tags: false,
        type: (subfields) ? 'multi' : 'single',
        extraFields: subfields || null,
      })

      this.setState({eventSchema, field: {name: '',subfields: [],}})
    }
  }

  deleteField(index) {
    let eventSchema = Object.assign([], this.state.eventSchema)
    eventSchema.splice(index, 1)
    this.setState({eventSchema})
  }

  addSubField() {
    let field = Object.assign({}, this.state.field)
    if (field.subfields.length < 4) {
      field.subfields.push('')
      this.setState({field})
    }
  }

  deleteSubfield(index) {
    let field = Object.assign({}, this.state.field)
    field.subfields.splice(index, 1)
    this.setState({field})
  }

  renderFields() {
    let eventSchema = Object.assign([], this.state.eventSchema)
    let renderFields = []
    eventSchema.forEach((data,index) => {
      let renderSubfields
      if (data.extraFields) {
        let extraFields = data.extraFields.join(', ');
        renderSubfields =
        <div className="moreEventOptions-fields-subfields">
          {extraFields}
        </div>
      }
      renderFields.push(
        <div className="moreEventOptions-fields" key={index}>
          <div className="moreEventOptions-fields-main">
            <div className="moreEventOptions-fields-main-text">
              {index + 1}. {data.fieldName}
            </div>
            <div className="moreEventOptions-fields-main-deleteField" onClick={() => this.deleteField(index)} />
          </div>
          {renderSubfields}
        </div>
      )
    })

    return renderFields
  }

  renderSubfields() {
    let field = Object.assign([], this.state.field)
    if (field.subfields.length > 0) {
      let renderSubfields = []
      field.subfields.forEach((data,index) => {
        renderSubfields.push(
          <div className="moreEventOptions-textInput-subfield" key={index}>
            <TextField
              handleChange={e => this.handleChange(e, index)}
              name={'subfield'}
              index={index}
              state={data}
              style={{
                height: '30px',
                fontSize: '0.9em'
              }}
            />
          <div className="moreEventOptions-textInput-subfield-deleteButton" onClick={() => this.deleteSubfield(index)}/>
          </div>
        )
      })

      return renderSubfields
    }
  }

  renderInputs() {
    return (
      <div className="moreEventOptions-textInput">
        <div className="moreEventOptions-textInput-mainField">
          <TextField
            handleChange={this.handleChange}
            name='name'
            state={this.state.field.name}
          />
          <div className="moreEventOptions-textInput-mainField-addButton" onClick={this.addField}/>
        </div>
        {this.renderSubfields()}
        <div className="moreEventOptions-textInput-addSubField" onClick={this.addSubField}/>
      </div>
    )
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
        {this.renderFields()}
        {this.renderInputs()}
        {this.renderWarning()}
        <div className="moreEventOptions-actions">
          <Button
            key='Set'
            onClick={this.onSubmit}
            name='Set'
            style={{
              backgroundColor: '#ffddcc',
              borderColor: '#ff884d',
              height: '50px',
              flex: 1,
            }}
          />
        </div>
      </div>
    )
  }
}

export default MoreEventOptionsModal
