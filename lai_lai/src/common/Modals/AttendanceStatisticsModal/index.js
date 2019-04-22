import React from 'react'
import Carousel from 'nuka-carousel';

import OverallAttendance from './OverallAttendance'
import OverallAttendeesAttendance from './OverallAttendeesAttendance'
import StatisticsApi from '../../../services/api/statistics'

import './index.css'

class AttendanceStatisticsModal extends React.Component {
  constructor(){
    super()

    this.state = {
      page: 'Overall Attendance',
      overallAttendance: {},
      overallAttendeesAttendance: {},
    }
    this.setPageName=this.setPageName.bind(this)
  }

  componentDidMount() {
    let { groupId } = this.props.modalProps
    StatisticsApi.getPast5Events(groupId)
    .then(res => {
      this.setState({overallAttendance: res})
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: 'Please refresh the page.'
    }))
    StatisticsApi.getAllAttendance(groupId)
    .then(res => {
      this.setState({overallAttendeesAttendance: res})
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: 'Please refresh the page.'
    }))
  }

  setPageName(index) {
    if (index === 0) this.setState({page: 'Overall Attendance'})
    else if (index === 1) this.setState({page: "Overall Attendee's Attendance"})
  }

  render() {
    return (
      <div className="attendanceStatisticsModal">
        <div className="attendanceStatisticsModal-header">
          <div className="attendanceStatisticsModal-header-text">{this.state.page}</div>
        </div>
        <div className="attendanceStatisticsModal-carousel">
          <Carousel
            renderCenterLeftControls={({ previousSlide }) => null}
            renderCenterRightControls={({ nextSlide }) => null}
            afterSlide={slideIndex => this.setPageName(slideIndex)}
          >
            <OverallAttendance
              overallAttendance={this.state.overallAttendance}
            />
            <OverallAttendeesAttendance
              overallAttendeesAttendance={this.state.overallAttendeesAttendance}
            />
          </Carousel>
        </div>
        <div className="modal-bottom--default" />
      </div>
    )
  }
}

export default AttendanceStatisticsModal
