import React from 'react'

import ExtraOptionsHelper from '../../../../helpers/ExtraOptionsHelper'

import './index.css'

class CommentsSummary extends React.Component {
  constructor(){
    super()

    this.state = {
      commentsSummary: {}
    }
  }

  componentDidMount() {
    let commentsSummary = ExtraOptionsHelper.getCommentsSummary(this.props.attendees, this.props.index)
    this.setState({commentsSummary})
  }

  onWhatsapp(number) {
    let whatsappUrl = 'https://wa.me/' + number
    window.open(whatsappUrl)
  }

  renderComments(comments) {
    if (comments) {
      if (comments.length > 0) {
        let renderComments = []
        comments.forEach((data, index) => {
          renderComments.push(
            <div className="commentsSummary-attendee-comments" key={index}>
              <div className="commentsSummary-attendee-comments-name">{data.name}:</div>
              <div className="commentsSummary-attendee-comments-comment">{data.comment}</div>
            </div>
          )
        })

        return renderComments
      }
    }
  }

  renderCommentsSummary() {
    let commentsSummary = Object.assign({}, this.state.commentsSummary)
    let renderCommentsSummary = []
    for (var key in commentsSummary) {
      if (commentsSummary.hasOwnProperty(key)) {
        renderCommentsSummary.push(
          <div className="commentsSummary-attendee" key={key}>
            <div className="commentsSummary-attendee-info">
              <div className="commentsSummary-attendee-info-name">{commentsSummary[key].name}</div>
              <div className="commentsSummary-attendee-info-whatsapp" onClick={() => this.onWhatsapp(commentsSummary[key].number)}/>
            </div>
            {this.renderComments(commentsSummary[key].comments)}
          </div>
        )
      }
    }

    return renderCommentsSummary
  }

  render() {
    return (
      <div className="commentsSummary">
        {this.renderCommentsSummary()}
      </div>
    )
  }
}

export default CommentsSummary
