import React from 'react'
import moment from 'moment'

import GroupsApi from '../../../services/api/groups'

import './index.css'

class AttendanceStatisticsModal extends React.Component {
  constructor(){
    super()

    this.state = {
      openTestimonials: [],
      closedTestimonials: [],
      testimonialState: 'open',
    }
    this.getTestimonials=this.getTestimonials.bind(this)
  }

  componentDidMount() {
    this.getTestimonials()
  }

  getTestimonials() {
    let { groupId } = this.props.modalProps
    GroupsApi.getOpenTestimonials(groupId)
    .then(res => {
      this.setState({openTestimonials: res})
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: 'Please refresh the page.'
    }))
    GroupsApi.getClosedTestimonials(groupId)
    .then(res => {
      this.setState({closedTestimonials: res})
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: 'Please refresh the page.'
    }))
  }

  renderAttendees() {
    if (this.state.testimonialState === 'open') {
      let testimonials = Object.assign([], this.state.openTestimonials)
      let renderAttendees = []
      if (testimonials.length > 0) {
        testimonials.forEach((data,index) => {
          renderAttendees.push(
            <div className="testimonialsSummaryModal-testimonials-attendee" key={index}>
              <div className="testimonialsSummaryModal-testimonials-attendee-header">{data.name}</div>
              {this.renderTestimonials(data.testimonials)}
            </div>
          )
        })

        return renderAttendees
      }
      else return this.noTestis()
    }
    else if (this.state.testimonialState === 'closed') {
      let testimonials = Object.assign([], this.state.closedTestimonials)
      let renderAttendees = []
      if (testimonials.length > 0) {
        testimonials.forEach((data,index) => {
          renderAttendees.push(
            <div className="testimonialsSummaryModal-testimonials-attendee" key={index}>
              <div className="testimonialsSummaryModal-testimonials-attendee-header">{data.name}</div>
              {this.renderTestimonials(data.testimonials)}
            </div>
          )
        })

        return renderAttendees
      }
      else return this.noTestis()
    }
  }

  renderTestimonials(testimonials) {
    if (testimonials.length > 0) {
      let renderTestimonials = []
      testimonials.forEach((data,index) => {
        let date = moment(data.created_at).format('MMMM Do YYYY, h:mm:ss a')
        renderTestimonials.push(
          <div className="testimonialsSummaryModal-testimonials-attendee-testimonial" key={index}>
            <div className="testimonialsSummaryModal-testimonials-attendee-testimonial-date">
              {date}
              {!data.seen ?
                <div className="testimonialsSummaryModal-testimonials-attendee-testimonial-date-close" onClick={() => this.closeTestimonial(data)}/>
              :
                null
              }
            </div>
            <div className="testimonialsSummaryModal-testimonials-attendee-testimonial-text">{data.testimonial}</div>
          </div>
        )
      })

      return renderTestimonials
    }
  }

  closeTestimonial(data) {
    GroupsApi.closeTestimonial(data.id)
    .then(res => {
      this.getTestimonials()
    })
    .catch(err => this.props.modalProps.setSnackbar('show', {
      text: 'Couldnt close testimonial'
    }))
  }

  noTestis() {
    return (
      <div className="testimonialsSummaryModal-testimonials-noTestimonials">
        There are no testimonials at the moment.
      </div>
    )
  }

  render() {
    let { testimonialState } = this.state
    return (
      <div className="testimonialsSummaryModal">
        <div className="testimonialsSummaryModal-header">
          <div className="testimonialsSummaryModal-header-text">Testimonies</div>
          <div className="testimonialsSummaryModal-header-inputSelector">
            <div className={"testimonialsSummaryModal-header-inputSelector-open " + testimonialState} onClick={() => this.setState({testimonialState: 'open'})} >Unseen</div>
            <div className={"testimonialsSummaryModal-header-inputSelector-closed " + testimonialState} onClick={() => this.setState({testimonialState: 'closed'})} >Seen</div>
          </div>
        </div>
        <div className="testimonialsSummaryModal-testimonials">
          {this.renderAttendees()}
        </div>
        <div className="modal-bottom--default" />
      </div>
    )
  }
}

export default AttendanceStatisticsModal
