import React from 'react'
import { connect } from 'react-redux'

const withTransactions = (Component) => {
  class WrapperComponent extends React.Component {
    render() {
      return (
        <Component { ... this.props } />
      )
    }
  }

  const mapStateToProps = (state) => ({
    transactions: state.transactionsReducer.transactions,
    pageState: state.transactionsReducer.pageState,
  })

  return connect(mapStateToProps)(WrapperComponent)
}

export default withTransactions
