import React from 'react'

import Button from '../../../common/Button'
import CheckBox from '../../../common/CheckBox'
import AttendanceApi from '../../../services/api/attendance'

import './index.css'

class EditAttendanceModal extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      showTags: false,
      selectedTag: '',
      selectedAttendance: '',
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
  }

  componentDidMount() {
    let { tags, status } = this.props.modalProps.attendee
    let selectedAttendance
    if (status === 'confirmed') selectedAttendance = true
    else selectedAttendance = false
    this.setState({ selectedAttendance, selectedTag: tags })
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    this.setState({[name]: value})
  }

  onSubmit() {
    let { attendee, eventId } = this.props.modalProps
    let { selectedTag, selectedAttendance } = this.state
    let updateAttendanceDict = {
      attendee_id: attendee.id,
      event_id: eventId,
      status: selectedAttendance,
      tags: selectedTag
    }

    AttendanceApi.updateAttendance(updateAttendanceDict)
    .then(res => {
      this.props.modalProps.getUser()
      this.props.setModal('hide')
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: "Could'nt update attendance."
    }))
  }

  renderTags() {
    let tags = this.props.modalProps.tags
    let showTags = this.state.showTags
    let renderTags = []

    tags.forEach((data,index) => {
      renderTags.push(
        <div className="editAttendanceModal-options-tags-input-selector-container-tag" key={index}>
          <div className="editAttendanceModal-options-tags-input-selector-container-name" onClick={() => this.setState({selectedTag: data.name})}>- {data.name} -</div>
        </div>
      )
    })

    return (
      <div className={"editAttendanceModal-options-tags-input-selector-container " + showTags}>
        {renderTags}
        <div className="editAttendanceModal-options-tags-input-selector-container-tag">
          <div className="editAttendanceModal-options-tags-input-selector-container-name" onClick={() => this.setState({selectedTag: ''})}>
            Remove Tag
          </div>
        </div>
      </div>
    )
  }

  setCheckbox() {
    this.setState({selectedAttendance: !this.state.selectedAttendance})
  }

  render() {
    let { name } = this.props.modalProps.attendee || ''
    let tag = this.state.selectedTag || 'No Tag'
    return (
      <div className="editAttendanceModal">
        <div className="editAttendanceModal-header">
          {name}s Attendance
        </div>
        <div className="editAttendanceModal-options">
          <div className="editAttendanceModal-options-attendance">
            <div className="editAttendanceModal-options-header">Attendance:</div>
            <div className="editAttendanceModal-options-attendance-input">
              <div className="editAttendanceModal-options-attendance-input-container">
                <CheckBox
                  setCheckbox={this.setCheckbox.bind(this)}
                  checkbox={this.state.selectedAttendance}
                />
              </div>
            </div>
          </div>
          <div className="editAttendanceModal-options-tags">
            <div className="editAttendanceModal-options-header">Tags:</div>
            <div className="editAttendanceModal-options-tags-input">
              <div className="editAttendanceModal-options-tags-input-selector" onClick={() => this.setState({showTags: !this.state.showTags})}>
                {this.renderTags()}
                <div className="editAttendanceModal-options-tags-input-selector-text">
                  {tag}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="editAttendanceModal-actions">
          <Button
            key='Update'
            onClick={this.onSubmit}
            name='Update'
            style={{
              backgroundColor: '#ccffee',
              borderColor: '#33ffbb',
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

export default EditAttendanceModal
