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
    getTransactionsFromNetwork: (iWallet, account, page, offset) => dispatch(actions.getTransactionsFromNetwork(iWallet, account, page, offset)),
    saveTransactions: (transactions) => dispatch(actions.saveTransactions(transactions)),
    saveOneTransaction: (transaction) => dispatch(actions.saveOneTransaction(transaction)),
    getTransactionsFromDB: (db, network, token) => dispatch(actions.getTransactionsFromDB(db, network, token)),
    saveTransactionsToDB: (db, network, token, transactions) => dispatch(actions.saveTransactionsToDB(db, network, token, transactions)),
    savePageState: (pageState) => dispatch(actions.savePageState(pageState)),
    saveEndReached: (endReached) => dispatch(actions.saveEndReached(endReached)),
    saveRefreshing: (refreshing) => dispatch(actions.saveRefreshing(refreshing)),
    saveRecentNotUpdated: (recentNotUpdated) => dispatch(actions.saveRecentNotUpdated(recentNotUpdated))
  })

  return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent)
}

export default withTransactions



