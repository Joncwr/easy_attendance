import React from 'react'

import ExtraOptionsHelper from '../../../helpers/ExtraOptionsHelper'
import CommentsSummary from './CommentsSummary'
import './index.css'

class SummaryModal extends React.Component {
  constructor(){
    super()

    this.state = {
      isSubfieldDrawerOpen: ['blank','blank','blank'],
      attendeesDrawerStatus: {},
      mainContent: 'attendees',
      mainContentIndex: 0,
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
        let renderSubfieldButtons = []
        if (subfieldsSummary) renderSubfieldButtons.push(
          <div className="summaryModal-main-mainSummary-options-icon selector" onClick={() => this.openSubfieldSummary(data.type, index)} key='selector'/>
        )
        else if (!subfieldsSummary && data.type === 'comments') renderSubfieldButtons.push(
          <div className="summaryModal-main-mainSummary-options-icon comments" onClick={() => this.openSubfieldSummary(data.type, index)} key='comments'/>
        )
        else renderSubfieldButtons.push(
          <div className="summaryModal-main-mainSummary-options-nullIcon" key='null'/>
        )
        renderExtraOptions.push(
          <div className="summaryModal-main-mainSummary-options" key={index}>
            <div className="summaryModal-main-mainSummary-options-name">
              {data.value}
            </div>
            <div className="summaryModal-main-mainSummary-options-true">
              Yes: {data.valueTrueCounter}
              {renderSubfieldButtons}
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

  openSubfieldSummary(dataType, index) {
    if (dataType === 'comments') {
      if (this.state.mainContent === 'attendees') this.setState({mainContent: 'commentsSummary', mainContentIndex: index})
      else if (this.state.mainContent === 'commentsSummary') this.setState({mainContent: 'attendees'})
    }
    else {
      let isSubfieldDrawerOpen = Object.assign([], this.state.isSubfieldDrawerOpen)
      if (isSubfieldDrawerOpen[index] && isSubfieldDrawerOpen[index] !== 'blank') {
        isSubfieldDrawerOpen[index] = false
      }
      else {
        isSubfieldDrawerOpen[index] = true
      }
      this.setState({isSubfieldDrawerOpen})
    }
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
              {this.renderAttendeesSubfields(data.extraFields, data.type)}
            </div>
          )
        }
      })

      return renderAttendeesOptions
    }
  }

  renderAttendeesSubfields(extraFields, dataType) {
    if (extraFields) {
      if (extraFields.length > 0) {
        let renderExtraFields = []
        if (dataType === 'multi' || dataType === 'single') {
          extraFields.forEach((data,index) => {
            renderExtraFields.push(
              <div className="summaryModal-main-attendees-attendee-options-subfields-subfield" key={index}>
                <div className="summaryModal-main-attendees-attendee-options-subfields-subfield-name">{data.name}</div>
                <div className={"summaryModal-main-attendees-attendee-options-subfields-subfield-icon " + data.value} />
              </div>
            )
          })
        }
        else if (dataType === 'comments') {
          extraFields.forEach((data,index) => {
            renderExtraFields.push(
              <div className="summaryModal-main-attendees-attendee-options-subfields-subfield" key={index}>
                <div className="summaryModal-main-attendees-attendee-options-subfields-subfield-name">{data.name}:</div>
                <div className="summaryModal-main-attendees-attendee-options-subfields-subfield-name" style={{fontWeight: '600', marginLeft: '10px'}}>{data.comment}</div>
              </div>
            )
          })
        }

        return renderExtraFields
      }
    }
  }

  renderAttendees() {
    let attendees = Object.assign([], this.props.modalProps.attendees)
    let renderAttendees = []
    attendees.forEach((data, index) => {
      if (data.status === 'confirmed') {
        let attendeesOptions = []
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
      }
    })

    return renderAttendees
  }

  renderContent() {
    if (this.state.mainContent === 'attendees') {
      return (
        <div className="summaryModal-main-attendees">
          {this.renderAttendees()}
        </div>
      )
    }
    else if (this.state.mainContent === 'commentsSummary') {
      return (
        <CommentsSummary
          attendees={this.props.modalProps.attendees}
          index={this.state.mainContentIndex}
        />
      )
    }
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
          {this.renderContent()}
        </div>
        <div className="modal-bottom--default" />
      </div>
    )
  }
}

export default SummaryModal
