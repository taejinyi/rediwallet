import React from 'react'
import { connect } from 'react-redux'

const withLock = (Component) => {
  class WrapperComponent extends React.Component {
    render() {
      return (
        <Component { ... this.props } />
      )
    }
  }

  const mapStateToProps = (state) => ({
    pinNumber: state.lockStateReducer.pinNumber,
  })

  return connect(mapStateToProps)(WrapperComponent)
}

export default withLock
