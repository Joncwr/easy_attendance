import React from 'react'

import Input from '../../../common/Input'
import Button from '../../../common/Button'
import UsersApi from '../../../services/api/users'

import './index.css'

class EditAttendanceModal extends React.Component {
  constructor(){
    super()

    this.state = {
      tags: [],
      name: '',
    }

    this.handleChange=this.handleChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
    this.deleteTag=this.deleteTag.bind(this)
  }

  componentDidMount() {
    this.setState({tags: this.props.modalProps.tags})
  }

  handleChange(event, index) {
    let name = event.target.name
    let value = event.target.value

    if (value.length < 20) {
      this.setState({[name]: value})
    }
  }

  onSubmit(method) {
    if (this.state.tags !== this.props.modalProps.tags) {
      let user_id = this.props.modalProps.userId
      let setTagDict = {
        user_id,
        tags: this.state.tags
      }
      UsersApi.setTags(setTagDict)
      .then(res => {
        this.props.modalProps.getUser()
        this.props.setModal('hide')
      })
      .catch(err => this.props.modalProps.setSnackbar('show', {
        text: "Could'nt update tags."
      }))
    }
    else {
      this.props.modalProps.setSnackbar('show', {
        text: "Tags are the same."
      })
    }
  }

  renderTags() {
    let tags = Object.assign([], this.state.tags)
    let renderTags = []
    if (tags.length > 0) {
      tags.forEach((data,index) => {
        renderTags.push(
          <div className="editTagsModal-tags-tag" key={index}>
            <div className="editTagsModal-tags-tag-text">
              {index+1}. {data.name}
            </div>
            <div className="editTagsModal-tags-tag-actions" onClick={() => this.deleteTag(tags, index)}/>
          </div>
        )
      })

      return renderTags
    }
  }

  deleteTag(tag, index) {
    let tags = Object.assign([], this.state.tags)
    tags.splice(index, 1)
    this.setState({tags})
  }

  addTag() {
    if (this.state.name) {
      let tags = Object.assign([], this.state.tags)
      if (tags.length < 4) {
        tags.push({
          name: this.state.name
        })
        this.setState({tags, name: ''})
      }
    }
  }

  render() {
    return (
      <div className="editTagsModal">
        <div className="editTagsModal-header">
          Edit Tags
        </div>
        <div className="editTagsModal-tags">
          {this.renderTags()}
        </div>
        <div className="editTagsModal-input">
          <Input
            handleChange={this.handleChange}
            name='name'
            state={this.state.name}
            style={{
              height: '50px',
              fontSize: '1.2em',
              width: '100%',
            }}
          />
        <div className="editTagsModal-input-action" onClick={this.addTag.bind(this)}/>
        </div>
        <div className="editTagsModal-actions">
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
