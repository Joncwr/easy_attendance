import React from 'react'
import {BarChart, Bar, XAxis, YAxis, ResponsiveContainer} from 'recharts'
import './index.css'

class overallAttendeesAttendance extends React.Component {
  constructor(){
    super()

    this.state = {
      overallAttendeesAttendance: [],
      height: 200,
    }

  }

  componentDidUpdate(prevProps) {
    if (prevProps.overallAttendeesAttendance !== this.props.overallAttendeesAttendance) {
      let attendance = this.props.overallAttendeesAttendance
      let overallAttendeesAttendance = []
      for (var key in attendance) {
        if (attendance.hasOwnProperty(key)) {
          let total = attendance[key].attended + attendance[key].neverAttend
          let percentage = (attendance[key].attended / total) * 100
          let eventAttendance = {
            name: attendance[key].name,
            percentage: percentage || 0
          }
          overallAttendeesAttendance.push(eventAttendance)
          overallAttendeesAttendance.push(eventAttendance)
          overallAttendeesAttendance.push(eventAttendance)
        }
      }
      let sortOverallAttendeesAttendance = overallAttendeesAttendance.sort((a,b) => {
        return b.percentage - a.percentage
      })
      let height = overallAttendeesAttendance.length * 40
      this.setState({overallAttendeesAttendance: sortOverallAttendeesAttendance, height})
    }
  }

  render() {
    return (
      <div className="overallAttendeesAttendance">
        <div className="overallAttendeesAttendance-container" style={{height: this.state.height + 'px'}}>
          <ResponsiveContainer  width="100%" height='100%'>
          	<BarChart
              width={500}
              data={this.state.overallAttendeesAttendance}
              margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              layout="vertical">
              <XAxis type="number" domain={[0, 100]} unit="%"/>
              <YAxis type="category" dataKey='name'/>
              <Bar
                background='#fff'
                label={label => {
                  return label.value.toFixed(1) + '%'
                }}
                dataKey="percentage"
                fill="#ff9999"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}

export default overallAttendeesAttendance
