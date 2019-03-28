import React from 'react'
import queryString from 'query-string'

import Button from '../../common/Button'
import LoadingOverlay from '../../common/LoadingOverlay'

import './index.css'

class Confirmation extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      hasAnswered: false,
      isLoading: false,
    }
    this.onPress=this.onPress.bind(this)
  }

  componentDidMount() {
    let query = queryString.parse(window.location.search);
    if (query.name) this.setState({name: query.name})

    let attendance = JSON.parse(localStorage.getItem('attendanceSheet')) || {}
    console.log(attendance);
  }

  onPress(status) {
    this.setState({isLoading: true}, () => {
      let attendance = JSON.parse(localStorage.getItem('attendanceSheet')) || {}
      attendance[this.state.name] = status
      localStorage.setItem('attendanceSheet', JSON.stringify(attendance))

      this.setState({isLoading: false, hasAnswered: true})
    })
  }

  renderScreen(date,name) {
    if (this.state.name && !this.state.hasAnswered) {
      return (
        <div className="confirmation--mainWrapper">
          <div className="confirmation-content">
            <img src='/img/graphic_cross_sad@3x.png' className="confirmation-content-graphic" />
            <div className="confirmation-content-message">
              <div className="confirmation-content-message-text">
                Hai <span style={{fontWeight: '700', color: '#ff8000'}}>{name}</span>, will you be joining us for the next bible study dated above?
              </div>
            </div>
          </div>
          <div className="confirmation-actions">
            <Button
              onClick={() => this.onPress('decline')}
              name='Decline'
              style={{
                backgroundColor: '#ffd1b3',
                borderColor: '#ff8533'
              }}
            />
            <Button
              onClick={() => this.onPress('confirm')}
              name='Confirm'
              style={{
                backgroundColor: '#e6ffe6',
                borderColor: '#66ff66'
              }}
            />
          </div>
        </div>
      )
    }
    else if (this.state.name && this.state.hasAnswered) {
      return (
        <div className="confirmation--mainWrapper">
          <div className="confirmation-content">
            <img src='/img/graphic_cross_happy@3x.png' className="confirmation-content-graphic" />
            <div className="confirmation-content-message">
              <div className="confirmation-content-message-text done">
                Thanks! Your request has been saved!
              </div>
            </div>
          </div>
          <div className="confirmation-actions">
          </div>
        </div>
      )
    }
    else if (!this.state.name) {
      return (
        <div className="confirmation--mainWrapper">
          <div className="confirmation-content">
            <img src='/img/graphic_cross_sad@3x.png' className="confirmation-content-graphic" />
            <div className="confirmation-content-message">
              <div className="confirmation-content-message-text error">
                Hai, was not able to get your name, please open the link from whatsapp again. If this continues, please contact your host.
              </div>
            </div>
          </div>
          <div className="confirmation-actions">
          </div>
        </div>
      )
    }
  }

  render() {
    let date = this.props.date || '-'
    let name = this.state.name
    return (
      <div className="confirmation">
        <LoadingOverlay
          isLoading={this.state.isLoading}
        />
        <div className="confirmation-header">
          <div className="confirmation-header-text">
            {date}
          </div>
        </div>
        {this.renderScreen(date,name)}
      </div>
    )
  }
}

export default Confirmation
