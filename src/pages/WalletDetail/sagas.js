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
  const { db, token, transactions } = action
  const dbIndex = "tx" + token

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
  const { db, token } = action
  const dbIndex = "tx" + token
  console.log('dbIndex', dbIndex)

  try {
    const fetchResult = yield call(() => db.get(dbIndex))
    console.log('dbIndex fetchResult', dbIndex, fetchResult._id, fetchResult.data.length)

    const transactions = fetchResult.data

    yield put({
      type: SAVE_TRANSACTIONS,
      transactions: transactions,
    })

    yield put({
      type: HIDE_PROCESSING_MODAL
    })
    console.log('HIDE_PROCESSING_MODAL')

  } catch (error) {
    return null
  }
}

export function* getTransactionsFromNetwork(action) {
  const { db, iWallet, account, page, offset } = action
  const token = account.address
  const dbIndex = "tx" + token
  // console.log('page, dbIndex', page, dbIndex)

  const response = yield call(() => iWallet.getTransactions(account.address, page, offset))
  let nextState = PAGE_STATE.STATE_LOADING_FINISH
  let updated = false

  try {
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
        console.log('originTransactions', originTransactions)
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
        // yield call(() => saveTransactionsToDB({db:db, token:token, transactions:newTransactions}))
      } catch (error) {
        console.log("error in getTransactionsFromNetwork", error)
        yield put({
          type: SAVE_TRANSACTIONS,
          transactions: transactions,
        })
        // yield call(() => saveTransactionsToDB({db:db, token:token, transactions:transactions}))
      }
    }


    yield put({
      type: HIDE_PROCESSING_MODAL
    })
    console.log('HIDE_PROCESSING_MODAL')

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
    console.log('error in getTransactionsFromNetwork', e)
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
      db: db,
      token: iWallet.currencyAddress,
      transaction: newTransaction,
    })


  } catch(e) {
    console.log('error in getTransactionFromNetwork', e)
    // TODK: Network error
  }
}


//TODO: add transaction for querying send gas expenses
export function* saveOneTransaction(action) {
  const { db, token, transaction } = action
  const dbIndex = "tx" + token

  try {
    const fetchResult = yield call(() => db.get(dbIndex))

    const transactionData = {
      [ transaction.transactionHash ]: {
        ... transaction,
      }
    }
    const transactions = Object.assign({}, fetchResult.data, transactionData)

    yield call(() => db.put({
      data: transactions,
      _id: dbIndex,
      _rev: fetchResult._rev,
    }))

    yield put({
      type: SAVE_TRANSACTIONS,
      transactions: transactions,
    })

  } catch (error) {
    console.log('error1 in saveOneTransaction', error)
    // console.log('transaction in saveOneTransaction', transaction)
    const { status } = error

    if(status === 404) {
      const transactionData = {
        [ transaction.transactionHash ]: {
          ... transaction,
        }
      }
      yield call(() => db.put({
        _id: dbIndex,
        data: transactionData,
      }))

      yield put({
        type: SAVE_TRANSACTIONS,
        transactions: transactionData,
      })
    }
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
