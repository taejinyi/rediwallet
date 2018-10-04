import React from 'react'
import { connect } from 'react-redux'

const withWallet = (Component) => {
  class WrapperComponent extends React.Component {
    render() {
      return (
        <Component { ... this.props } />
      )
    }
  }

  const mapStateToProps = (state) => ({
    wallet: state.walletReducer.wallet,
  })

  return connect(mapStateToProps)(WrapperComponent)
}

export default withWallet
