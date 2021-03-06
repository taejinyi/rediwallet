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
    seed: state.appStateReducer.seed,
  })

  return connect(mapStateToProps)(WrapperComponent)
}

export default withLock
