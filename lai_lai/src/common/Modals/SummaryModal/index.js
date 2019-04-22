import React from 'react'

import ExtraOptionsHelper from '../../../helpers/ExtraOptionsHelper'
import './index.css'

class SummaryModal extends React.Component {
  constructor(){
    super()

    this.state = {
      isSubfieldDrawerOpen: ['blank','blank','blank'],
      attendeesDrawerStatus: {},
    }
  }

  componentDidMount() {
    let attendees = Object.assign([], this.props.modalProps.attendees)
    if (attendees.length > 0) {
      let attendeesDrawerStatus = {}
      attendees.forEach(data => {
        let drawerArr = []
        if (data.eventOptions) {
          if (data.eventOptions.length > 0) {
            data.eventOptions.forEach(() => {
              drawerArr.push('blank')
            })
          }
        }
        attendeesDrawerStatus[data.name] = drawerArr
      })
      this.setState({attendeesDrawerStatus})
    }
  }

  getMainSummary() {
    if (this.props.modalProps.attendanceSummary) {
      let { confirmed, declined, uncertain } = this.props.modalProps.attendanceSummary
      let mainSummary = [
        <div className="summaryModal-main-mainSummary-item" key='confirmed'>Confirmed: {confirmed}</div>,
        <div className="summaryModal-main-mainSummary-item" key='declined'>Declined: {declined}</div>,
        <div className="summaryModal-main-mainSummary-item" key='uncertain'>Uncertain: {uncertain}</div>
      ]
      return mainSummary
    }
    else {
      return 'Unable to get summary'
    }
  }

  onWhatsapp(number) {
    let whatsappUrl = 'https://wa.me/' + number
    window.open(whatsappUrl)
  }

  getOptionsSummary() {
    if (this.props.modalProps.extraOptions) {
      let extraOptions = Object.assign([], this.props.modalProps.extraOptions)
      let attendees = Object.assign([], this.props.modalProps.attendees)
      let renderExtraOptions = []
      extraOptions.forEach((data,index) => {
        let subfieldsSummary = ExtraOptionsHelper.getSubfieldSummary(attendees, data.value)
        renderExtraOptions.push(
          <div className="summaryModal-main-mainSummary-options" key={index}>
            <div className="summaryModal-main-mainSummary-options-name">
              {data.value}
            </div>
            <div className="summaryModal-main-mainSummary-options-true">
              Yes: {data.valueTrueCounter}
              {(subfieldsSummary) ?
                <div className="summaryModal-main-mainSummary-options-icon" onClick={() => this.openSubfieldSummary(index)}/>
              :
                <div className="summaryModal-main-mainSummary-options-nullIcon" />
              }
            </div>
          </div>,
          <div className={"summaryModal-main-mainSummary-options-subfieldSummary " + this.state.isSubfieldDrawerOpen[index]} key={'subfield' + index}>
            {this.renderSubfields(subfieldsSummary)}
          </div>
        )
      })
      return renderExtraOptions
    }
  }

  openSubfieldSummary(index) {
    let isSubfieldDrawerOpen = Object.assign([], this.state.isSubfieldDrawerOpen)
    if (isSubfieldDrawerOpen[index] && isSubfieldDrawerOpen[index] !== 'blank') {
      isSubfieldDrawerOpen[index] = false
    }
    else {
      isSubfieldDrawerOpen[index] = true
    }
    this.setState({isSubfieldDrawerOpen})
  }

  openAttendeesSubfield(name, index) {
    let attendeesDrawerStatus = Object.assign({}, this.state.attendeesDrawerStatus)
    if (attendeesDrawerStatus[name]) {
      if (attendeesDrawerStatus[name][index] && attendeesDrawerStatus[name][index] !== 'blank') {
        attendeesDrawerStatus[name][index] = false
      }
      else {
        attendeesDrawerStatus[name][index] = true
      }
      this.setState({attendeesDrawerStatus})
    }
  }

  renderSubfields(subfieldsSummary) {
    if (subfieldsSummary) {
      let renderSubfieldsSummary = []
      for (var key in subfieldsSummary) {
        if (subfieldsSummary.hasOwnProperty(key)) {
          renderSubfieldsSummary.push(
            <div key={key} className="summaryModal-main-mainSummary-options-subfieldSummary-subfield">
              <div className="summaryModal-main-mainSummary-options-subfieldSummary-subfield-header">{key}:</div>
              <div className="summaryModal-main-mainSummary-options-subfieldSummary-subfield-value">{subfieldsSummary[key]}</div>
            </div>
          )
        }
      }

      return renderSubfieldsSummary
    }
  }

  renderAttendeesOptions(attendeesOptions, name) {
    if (attendeesOptions.length > 0) {
      let renderAttendeesOptions = []
      attendeesOptions.forEach((data, index) => {
        let attending = (data.value) ? 'Yes' : 'No'
        renderAttendeesOptions.push(
          <div className="summaryModal-main-attendees-attendee-options-option" key={index}>
            <div className="summaryModal-main-attendees-attendee-options-option-name">
              {data.fieldName}
            </div>
            <div className="summaryModal-main-attendees-attendee-options-option-value">
              {attending}
              {(data.value) ?
                <div className="summaryModal-main-attendees-attendee-options-value-icon" onClick={() => this.openAttendeesSubfield(name, index)}/>
                :
                <div className="summaryModal-main-attendees-attendee-options-value-nullIcon" />
              }
            </div>
          </div>
        )
        if (this.state.attendeesDrawerStatus[name] && data.value) {
          renderAttendeesOptions.push(
            <div className={"summaryModal-main-attendees-attendee-options-subfields " + this.state.attendeesDrawerStatus[name][index]} key={name + index}>
              {this.renderAttendeesSubfields(data.extraFields)}
            </div>
          )
        }
      })

      return renderAttendeesOptions
    }
  }

  renderAttendeesSubfields(extraFields) {
    if (extraFields) {
      if (extraFields.length > 0) {
        let renderExtraFields = []
        extraFields.forEach((data,index) => {
          renderExtraFields.push(
            <div className="summaryModal-main-attendees-attendee-options-subfields-subfield" key={index}>
              <div className="summaryModal-main-attendees-attendee-options-subfields-subfield-name">{data.name}</div>
              <div className={"summaryModal-main-attendees-attendee-options-subfields-subfield-icon " + data.value} />
            </div>
          )
        })

        return renderExtraFields
      }
      console.log(extraFields);
    }
  }

  renderAttendees() {
    let attendees = Object.assign([], this.props.modalProps.attendees)
    let renderAttendees = []
    attendees.forEach((data, index) => {
      let attendeesOptions
      if (data.eventOptions) attendeesOptions = data.eventOptions
      renderAttendees.push(
        <div className="summaryModal-main-attendees-attendee" key={index}>
          <div className="summaryModal-main-attendees-attendee-info">
            <div className="summaryModal-main-attendees-attendee-info-name">
              {data.name}
            </div>
            <div className="summaryModal-main-attendees-attendee-info-actions">
              <div className="summaryModal-main-attendees-attendee-info-actions-whatsapp" onClick={() => this.onWhatsapp(data.number)}/>
            </div>
          </div>
          <div className="summaryModal-main-attendees-attendee-options">
            {this.renderAttendeesOptions(attendeesOptions, data.name)}
          </div>
        </div>
      )
    })

    return renderAttendees
  }

  render() {
    let style
    if (this.props.modalProps) {
      if (this.props.modalProps.style) style = this.props.modalProps.style
    }
    return (
      <div className="summaryModal">
        <div className="summaryModal-header" style={style}>
          Attendance Summary
        </div>
        <div className="summaryModal-main">
          <div className="summaryModal-main-mainSummary">
            {this.getMainSummary()}
          </div>
          <div className="summaryModal-main-optionsSummary">
            {this.getOptionsSummary()}
          </div>
          <div className="summaryModal-main-attendees">
            {this.renderAttendees()}
          </div>
        </div>
        <div className="modal-bottom--default" />
      </div>
    )
  }
}

export default SummaryModal
