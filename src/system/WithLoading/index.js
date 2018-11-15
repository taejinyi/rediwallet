import React from 'react'
import { connect } from 'react-redux'

const withLoading = (Component) => {
  class WrapperComponent extends React.Component {
    render() {
      return (
        <Component { ... this.props } />
      )
    }
  }

  const mapStateToProps = (state) => ({
    isLoading: state.appStateReducer.isLoading,
  })

  return connect(mapStateToProps)(WrapperComponent)
}

export default withLoading
