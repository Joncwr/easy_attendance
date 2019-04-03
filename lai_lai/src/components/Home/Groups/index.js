import React from 'react'

import Button from '../../../common/Button'

import './index.css'

class Groups extends React.Component {
  constructor(){
    super()

    this.state = {

    }
  }

  componentDidMount() {
  }

  renderGroups() {
    if (this.props.groups.length > 0) {
      let renderGroups = []
      let groupsArr = Object.assign([], this.props.groups)

      groupsArr.forEach((data,index) => {
        renderGroups.push(
          <div className="home-groups-info-group" key={index}>
            <div className="home-groups-info-group-id">{index + 1}.</div>
            <div className="home-groups-info-group-name">{data.group_name}</div>
            <div className="home-groups-info-group-actions">
              <div className="home-groups-info-group-actions-edit" onClick={() => this.props.onGroupAction('edit')}/>
              <div className="home-groups-info-group-actions-delete" onClick={() => this.props.onGroupAction('delete')}/>
            </div>
          </div>
        )
      })

      return renderGroups
    }
  }

  render() {
    return (
      <div className="home-groups--mainWrapper">
        <div className="home-groups">
          <div className="home-groups-headers">
            <div className="home-groups-headers-index">No.</div>
            <div className="home-groups-headers-name">Name</div>
            <div className="home-groups-headers-actions" />
          </div>
          <div className="home-groups-info">
            {this.renderGroups()}
          </div>
        </div>
        <div className="home-actions home-actions--groups">
          <Button
            onClick={() => this.props.onGroupAction('create')}
            name='Create Group'
            style={{
              backgroundColor: '#ffddcc',
              borderColor: '#ff884d',
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

export default Groups
