import React from 'react'

import './index.css'

class DropDownComponent extends React.Component {
  constructor(){
    super()

    this.state = {
      groups: [],
    }

  }

  componentDidMount() {
    if (this.props.user) {
      this.setState({groups: this.props.user.groups})
    }
  }

  renderGroups() {
    let groups = this.state.groups
    if (this.state.groups.length > 0) {
      let renderGroups = []
      groups.forEach((data,index) => {
        renderGroups.push(
          <div className="dropDownComponent-group" key={index} onClick={() => this.props.onChangeGroup(index)}>
            <div className="dropDownComponent-group-text">
              - {data.group_name} -
            </div>
          </div>
        )
      })

      return renderGroups
    }
  }

  render() {
    return (
      <div className="dropDownComponent">
        {this.renderGroups()}
      </div>
    )
  }
}

export default DropDownComponent
