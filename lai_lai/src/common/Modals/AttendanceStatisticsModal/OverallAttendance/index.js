import React from 'react'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'
import './index.css'

class overallAttendance extends React.Component {
  constructor(){
    super()

    this.state = {
      overallAttendance: []
    }

  }

  componentDidUpdate(prevProps) {
    if (prevProps.overallAttendance !== this.props.overallAttendance) {
      let attendance = this.props.overallAttendance
      let overallAttendance = []
      for (var key in attendance) {
        if (attendance.hasOwnProperty(key)) {
          let total = attendance[key].true + attendance[key].false
          let percentage = (attendance[key].true / total) * 100
          let eventAttendance = {
            name: attendance[key].name,
            percentage: percentage || 0
          }
          overallAttendance.push(eventAttendance)
        }
      }
      this.setState({overallAttendance})
    }
  }

  render() {
    let areaChartColor = '#ff7733'
    return (
      <div className="overallAttendance">
        <ResponsiveContainer  width="100%"height={200}>
          <AreaChart data={this.state.overallAttendance}
            margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaChartColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={areaChartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" fontSize='.8em'/>
            <YAxis domain={[0, 100]}/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="percentage" stroke={areaChartColor} fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export default overallAttendance
