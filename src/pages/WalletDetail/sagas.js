import _ from 'lodash'
import { call, put, take, select, takeEvery } from 'redux-saga/effects'


import {
  SAVE_TRANSACTIONS,
  SAVE_TRANSACTIONS_TO_DB,
  GET_TRANSACTIONS_FROM_DB,
  SAVE_ONE_TRANSACTION,
  SAVE_PAGE_STATE,
  PAGE_STATE,
  GET_TRANSACTIONS_FROM_NETWORK,
  GET_TRANSACTION_FROM_NETWORK,
  SAVE_RECENT_NOT_UPDATED,
} from './actions'
import {HIDE_PROCESSING_MODAL} from "../../actions";


export function* saveTransactionsToDB(action) {
  const { db, network, token, transactions } = action
  const dbIndex = "tx" + network + token

  yield call(() => retryUntilWritten(db, dbIndex, transactions))
  // yield put({
  //   type: SAVE_TRANSACTIONS,
  //   transactions: transactions,
  // })
}

function retryUntilWritten(db, index, data) {
  // console.log("in retryUntilWritten", index, _.values(data).length)
  return db.get(index).then(function (origDoc) {
    return db.put({
      data: data,
      _id: index,
      _rev: origDoc._rev,
    });
  }).catch(function (err) {
    if (err.status === 409) {
      return retryUntilWritten(db, index, data);
    } else { // new doc
      return db.put({
        data: data,
        _id: index,
      });
    }
  });
}


export function* getTransactionsFromDB(action) {
  const { db, network, token } = action
  const dbIndex = "tx" + network + token
  // console.log('dbIndex in getTransactionsFromDB', dbIndex)

  try {
    const fetchResult = yield call(() => db.get(dbIndex))
    // console.log('dbIndex fetchResult', dbIndex, fetchResult._id, _.values(fetchResult.data).length)

    const transactions = fetchResult.data

    yield put({
      type: SAVE_TRANSACTIONS,
      transactions: transactions,
    })

    yield put({
      type: HIDE_PROCESSING_MODAL
    })

  } catch (error) {
    return null
  }
}

export function* getTransactionsFromNetwork(action) {

  try {
    const { iWallet, account, page, offset } = action
    const response = yield call(() => iWallet.getTransactions(account.address, page, offset))
    let nextState = PAGE_STATE.STATE_LOADING_FINISH
    let updated = false
    if(response && response.status === 200) {
      const data = response.data.result
      if (data.length === 0) {
        yield put({
          type: SAVE_PAGE_STATE,
          pageState: PAGE_STATE.STATE_LOADING_COMPLETE,
        })
        yield put({
          type: HIDE_PROCESSING_MODAL
        })
        return
      } else if (data.length < offset) {
        nextState = PAGE_STATE.STATE_LOADING_COMPLETE
      }
      let transactions = {}
      let i

      for(i=0; i < data.length; i++) {
        const hash = data[i].hash
        const fromMe = data[i].from.toLowerCase() === iWallet.address.toLowerCase()
        const toMe = data[i].to.toLowerCase() === iWallet.address.toLowerCase()
        // console.log("fromMe, toMe", i, fromMe, toMe, data[i].from, data[i].to, iWallet.address)

        const newTransaction = {
          [ hash ]: {
            fromMe,
            toMe,
            ... data[i],
          }
        }
        transactions = Object.assign(newTransaction, transactions)
      }
      try {
        let originTransactions = yield select((state) => state.transactionsReducer.transactions)
        //
        if(!originTransactions || !Object.keys(originTransactions).length) {
          yield put({
            type: SAVE_TRANSACTIONS,
            transactions: transactions,
          })
          updated = true
        } else {
          const newTransactions = Object.assign({}, originTransactions, transactions)
          yield put({
            type: SAVE_TRANSACTIONS,
            transactions: newTransactions,
          })
          _.keys(transactions).forEach((key) => {
            // console.log("in forEach", key)
            if (originTransactions.hasOwnProperty(key)) {
              updated = true
            }
          })

        }
      } catch (error) {
        console.log("error1 in getTransactionsFromNetwork", error)
        yield put({
          type: SAVE_TRANSACTIONS,
          transactions: transactions,
        })
      }
    }


    yield put({
      type: HIDE_PROCESSING_MODAL
    })

    yield put({
      type: SAVE_PAGE_STATE,
      pageState: nextState,
    })

    if (updated === false) {
      yield put({
        type: SAVE_RECENT_NOT_UPDATED,
        recentNotUpdated: true,
      })
    }

  } catch(e) {
    console.log('error2 in getTransactionsFromNetwork', e)
    // TODK: Network error
  }
}

export function* getTransactionFromNetwork(action) {
  // TODO: set transaction.isLoading = true
  try {
    const { db, iWallet, transactionHash } = action
    const decodedTx = yield call(() => iWallet.getTransaction(transactionHash))

    const newTransaction = {
      [ transactionHash ]: {
        ... decodedTx
      }
    }
    console.log('newTransaction in getTransactionFromNetwork', newTransaction)

    yield call(saveOneTransaction, {
      transaction: newTransaction,
    })


  } catch(e) {
    console.log('error in getTransactionFromNetwork', e)
    // TODK: Network error
  }
}


//TODO: add transaction for querying send gas expenses
export function* saveOneTransaction(action) {
  // const { network, token, transaction } = action
  const { transaction } = action
  try {
    let transactions = {}
    let originTransactions = yield select((state) => state.transactionsReducer.transactions)

    const transactionData = {
      [ transaction.hash ]: {
        ... transaction,
      }
    }

    if (originTransactions && _.values(originTransactions).length > 0) {
      transactions = Object.assign({}, originTransactions, transactionData)
    } else {
      transactions = transactionData
    }
    yield put({
      type: SAVE_TRANSACTIONS,
      transactions: transactions,
    })
  } catch (e) {
    console.log("error in saveOneTransaction", e)
  }
}

const transactionsSagas = [
  takeEvery(SAVE_TRANSACTIONS_TO_DB, saveTransactionsToDB),
  takeEvery(GET_TRANSACTIONS_FROM_DB, getTransactionsFromDB),
  takeEvery(GET_TRANSACTIONS_FROM_NETWORK, getTransactionsFromNetwork),
  takeEvery(GET_TRANSACTION_FROM_NETWORK, getTransactionFromNetwork),
  takeEvery(SAVE_ONE_TRANSACTION, saveOneTransaction),
]

export default transactionsSagas
