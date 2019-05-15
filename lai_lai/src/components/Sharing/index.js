import React from 'react'
import queryString from 'query-string'
import Dropdown from 'react-dropdown';
import Button from '../../common/Button'
import PublicApi from '../../services/api/publicapi'
import 'react-dropdown/style.css';

import './index.css'
const options = [
  {value: 'lol', label: 'lolol'},
  'odwadawdawdawdwadawdawdwne', 'two', 'three'
];
class Sharing extends React.Component {
  constructor(){
    super()

    this.state = {
      text: '',
      attendees: [],
      selectedAttendee: {},
      hasSubmitted: false,
    }
    this.handleChange=this.handleChange.bind(this)
    this._onSelect=this._onSelect.bind(this)
  }

  componentDidMount() {
    let query = queryString.parse(window.location.search);
    PublicApi.getAttendees(query.groupId)
    .then(res => {
      let attendees = []
      res.forEach((data, index) => {
        attendees.push({
          value: data.id,
          label: data.name,
        })
      })
      this.setState({attendees})
    })
    .catch(err => this.props.setSnackbar('show', {
      text: 'Please refresh the page.'
    }))
  }

  handleChange(event) {
    let name = event.target.name
    let value = event.target.value

    this.setState({[name]: value})
  }

  onPress() {
    if (this.state.text === '') {
      this.props.setSnackbar('show', {
        text: 'Please share something.'
      })
      return
    }
    if (!this.state.selectedAttendee.id) {
      this.props.setSnackbar('show', {
        text: 'Please select your name.'
      })
      return
    }
    else {
      let query = queryString.parse(window.location.search);
      let testimonialDict = { testimonial: this.state.text, group_id: query.groupId }
      PublicApi.addTestimonial(this.state.selectedAttendee.id, testimonialDict)
      .then(res => {
        this.setState({hasSubmitted: true})
      })
      .catch(err => {
        this.props.setSnackbar('show', {
          text: 'Unable to send, please try again.'
        })
      })
    }
  }

  _onSelect(value) {
    this.setState({selectedAttendee: {
      id: value.value,
      name: value.label
    }})
  }

  render() {
    return (
      <div className="sharing">
        <div className="sharing-header">
          Sharing is Caring
        </div>
        { !this.state.hasSubmitted ?
          <div className="sharing-input">
            <div className="sharing-input-image" />
            <div className="sharing-input-attendees">
              <Dropdown
                value={this.state.selectedAttendee.name}
                options={this.state.attendees}
                onChange={this._onSelect}
                placeholder="Select your name"
                className='sharing-dropDown'
                controlClassName='sharing-dropDownControl'
                menuClassName='sharing-dropDownMenu'
              />
            </div>
            <textarea
              className='sharing-input-textarea'
              name="text"
              onChange={this.handleChange}
              value={this.state.text}
              placeholder='Please write your sharing here.'
            />
            <div className="sharing-input-actions">
              <Button
                onClick={this.onPress.bind(this)}
                name='Send'
                style={{
                  backgroundColor: '#ffddcc',
                  borderColor: '#ff884d',
                  margin: '0 10px',
                  width: '50%',
                  height: '50px',
                }}
              />
            </div>
          </div>
        :
          <div className="sharing-done">
            <div className="sharing-input-image" />
            <div className="sharing-done-text">
              Thank you so much for sharing today. God Bless!
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Sharing
