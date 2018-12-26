import React from 'react'
import { connect } from 'react-redux'
import {actions} from "../../pages";

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
    iWallet: state.walletReducer.iWallet,
  })

  const mapDispatchToProps = (dispatch) => ({
    saveWalletToDB: (db, wallet) => dispatch(actions.saveWalletToDB(db, wallet)),
    saveWalletInstance: (iWallet) => dispatch(actions.saveWalletInstance(iWallet)),
    saveWalletInstanceToDB: (db, iWallet) => dispatch(actions.saveWalletInstanceToDB(db, iWallet)),
    getWalletFromNetwork: (iWallet) => dispatch(actions.getWalletFromNetwork(iWallet)),
    showProcessingModal: (message) => dispatch(actions.showProcessingModal(message)),
    hideProcessingModal: () => dispatch(actions.hideProcessingModal()),
  })

  return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent)
}

export default withWallet
