import React from 'react'

import Input from '../../common/Input'
import LoginApi from '../../services/auth/login'

import './index.css'

class Login extends React.Component {
  constructor(){
    super()

    this.state = {
      username: '',
      password: '',
    }
    this.onPress=this.onPress.bind(this)
    this.handleChange=this.handleChange.bind(this)
  }

  componentDidMount() {
    if (localStorage.getItem('user')) {
      this.props.history.push('home')
    }
  }

  onPress() {
    LoginApi.login(this.state.username, this.state.password)
    .then(res => {
      let userCredentials = {
        userId: res.userDetails.id,
        token: res.token
      }
      localStorage.setItem('user', JSON.stringify(userCredentials))
      this.props.history.push('home')
    })
    .catch(err => console.log(err))
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    this.setState({[name]: value})
  }

  render() {
    let style = {
      marginBottom: '20px',
    }
    return (
      <div className="login">
        <div className="login-container">
          <div className="login-container-header">Login</div>
          <div className="login-container-input">
            <Input
              handleChange={this.handleChange}
              name='username'
              state={this.state.username}
              style={style}
              placeholder='Username'
            />
            <Input
              handleChange={this.handleChange}
              name='password'
              type='password'
              state={this.state.password}
              style={style}
              placeholder='Password'
            />
          </div>
          <div className="login-actions">
            <div className="login-actions-container" onClick={this.onPress}>
              <div className="login-actions-container-icon" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
