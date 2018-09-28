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
    mnemonic: state.appStateReducer.mnemonic,
  })

  return connect(mapStateToProps)(WrapperComponent)
}

export default withLock
