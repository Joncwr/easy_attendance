import React from 'react'

import Input from '../../common/Input'

import './index.css'

class Registation extends React.Component {
  constructor(){
    super()

    this.state = {
      name: '',
      email: '',
      hasRequested: false,
    }
    this.onPress=this.onPress.bind(this)
    this.handleChange=this.handleChange.bind(this)
  }

  componentDidMount() {
  }

  onPress() {
    this.setState({hasRequested: true})
    window.open('https://wa.me/14155238886/?text=join%20think-ground')
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    this.setState({[name]: value})
  }

  renderScreen() {
    let style = {
      marginBottom: '20px',
    }
    if (this.state.hasRequested) {
      return (
        <div className="login-container-request">
          hi
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="login-container-input">
            <Input
              handleChange={this.handleChange}
              name='name'
              state={this.state.name}
              style={style}
              placeholder='Name'
            />
            <Input
              handleChange={this.handleChange}
              name='email'
              state={this.state.email}
              style={style}
              placeholder='Email'
            />
          </div>
          <div className="login-actions">
            <div className="login-actions-container" onClick={this.onPress}>
              <div className="login-actions-container-icon" />
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="login">
        <div className="login-container">
          <div className="login-container-header">Registation</div>
          {this.renderScreen()}
        </div>
      </div>
    )
  }
}

export default Registation
