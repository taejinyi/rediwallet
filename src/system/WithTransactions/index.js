import React from 'react'
import { connect } from 'react-redux'
import {actions} from "../../pages";

const withTransactions = (Component) => {
  class WrapperComponent extends React.Component {
    render() {
      return (
        <Component { ... this.props } />
      )
    }
  }

  const mapStateToProps = (state) => ({
    refreshing: state.transactionsReducer.refreshing,
    endReached: state.transactionsReducer.endReached,
    recentNotUpdated: state.transactionsReducer.recentNotUpdated,
    pageState: state.transactionsReducer.pageState,
    transactions: state.transactionsReducer.transactions,
  })

  const mapDispatchToProps = (dispatch) => ({
    getTransactionFromNetwork: (db, iWallet, hash) => dispatch(actions.getTransactionFromNetwork(db, iWallet, hash)),
    getTransactionsFromNetwork: (db, iWallet, account, page, offset) => dispatch(actions.getTransactionsFromNetwork(db, iWallet, account, page, offset)),
    saveTransactions: (transactions) => dispatch(actions.saveTransactions(transactions)),
    saveOneTransaction: (db, token, transaction) => dispatch(actions.saveOneTransaction(db, token, transaction)),
    getTransactionsFromDB: (db, token) => dispatch(actions.getTransactionsFromDB(db, token)),
    savePageState: (pageState) => dispatch(actions.savePageState(pageState)),
    saveEndReached: (endReached) => dispatch(actions.saveEndReached(endReached)),
    saveRefreshing: (refreshing) => dispatch(actions.saveRefreshing(refreshing)),
    saveRecentNotUpdated: (recentNotUpdated) => dispatch(actions.saveRecentNotUpdated(recentNotUpdated))
  })

  return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent)
}

export default withTransactions



