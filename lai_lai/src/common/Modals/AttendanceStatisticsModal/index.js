import React from 'react'
import Carousel from 'nuka-carousel';

import OverallAttendance from './OverallAttendance'
import StatisticsApi from '../../../services/api/statistics'

import './index.css'

class AttendanceStatisticsModal extends React.Component {
  constructor(){
    super()

    this.state = {
      page: 'Overall Attendance',
      overallAttendance: {},
    }

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
  }

  render() {
    return (
      <div className="attendanceStatisticsModal">
        <div className="attendanceStatisticsModal-header">
          <div className="attendanceStatisticsModal-header-text">{this.state.page}</div>
        </div>
        <div className="attendanceStatisticsModal-carousel">
          <Carousel>
            <OverallAttendance
              overallAttendance={this.state.overallAttendance}
            />
          </Carousel>
        </div>
      </div>
    )
  }
}

export default AttendanceStatisticsModal
