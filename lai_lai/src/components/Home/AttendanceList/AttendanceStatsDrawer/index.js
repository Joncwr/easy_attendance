import React from 'react'

import './index.css'

class AttendanceStatsDrawer extends React.Component {
  constructor(){
    super()

    this.state = {

    }

  }

  renderExtraOptions(extraOptions) {
    if (extraOptions.values) {
      let renderExtraOptions = []
      extraOptions.values.forEach((data, index) => {
        let valueKey = data
        let fieldName = extraOptions[valueKey]
        let trueCounter = extraOptions[valueKey+'TrueCounter']
        let falseCounter = extraOptions[valueKey+'FalseCounter']

        renderExtraOptions.push(
          <div className="attendanceStatsDrawer-extraOptions-scrollable-option" key={index}>
            <div className="attendanceStatsDrawer-extraOptions-scrollable-option-name">
              {fieldName}
            </div>
            <div className="attendanceStatsDrawer-extraOptions-scrollable-option-true">
              Yes: {trueCounter}
            </div>
            <div className="attendanceStatsDrawer-extraOptions-scrollable-option-false">
              No: {falseCounter}
            </div>
          </div>
        )
      })

      return renderExtraOptions
    }
  }

  render() {
    let { confirmed, declined, uncertain, isDrawerOpen, extraOptions, drawerDisplay } = this.props
    return (
      <div className={"attendanceStatsDrawer " + isDrawerOpen} onClick={() => this.props.setDrawer(!this.props.isDrawerOpen)}>
        <div className="attendanceStatsDrawer-drawerIcon">
          <div className={"attendanceStatsDrawer-drawerIcon-icon " + isDrawerOpen} />
        </div>
        <div className="attendanceStatsDrawer-basic">
          <div className="attendanceStatsDrawer-basic-confirm">
            <div className="attendanceStatsDrawer-basic-header">
              Confirmed:
            </div>
            <div className="attendanceStatsDrawer-basic-value">
              {confirmed}
            </div>
          </div>
          <div className="attendanceStatsDrawer-basic-declined">
            <div className="attendanceStatsDrawer-basic-header">
              Declined:
            </div>
            <div className="attendanceStatsDrawer-basic-value">
              {declined}
            </div>
          </div>
          <div className="attendanceStatsDrawer-basic-null">
            <div className="attendanceStatsDrawer-basic-header">
              Uncertain:
            </div>
            <div className="attendanceStatsDrawer-basic-value">
              {uncertain}
            </div>
          </div>
        </div>
        <div className="attendanceStatsDrawer-extraOptions" style={{display: drawerDisplay}}>
          <div className="attendanceStatsDrawer-extraOptions-scrollable">
            {this.renderExtraOptions(extraOptions)}
          </div>
        </div>
      </div>
    )
  }
}

export default AttendanceStatsDrawer
