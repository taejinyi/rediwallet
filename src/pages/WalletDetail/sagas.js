import { call, put, take, takeEvery } from 'redux-saga/effects'

import * as server from '../../network/server'

import {
  SAVE_TRANSACTIONS,
  SAVE_TRANSACTIONS_TO_DB,
  GET_TRANSACTIONS_FROM_DB,
  GET_TRANSACTIONS_FROM_SERVER,
  GET_NEXT_TRANSACTIONS_ONLY_STATE,
  SAVE_ONE_TRANSACTION,
  SAVE_PAGE_STATE,
  PAGE_STATE,
} from './actions'
import {HIDE_PROCESSING_MODAL} from "../../actions";


export function* saveTransactionsToDB(action) {
  const { db, wallet, account, transactions } = action
  const dbIndex = "tx" + account.currency

  try {
    const fetchResult = yield call(() => db.get(dbIndex))

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
    const { status } = error

    if(status === 404) {
      yield call(() => db.put({
        _id: dbIndex,
        data: transactions,
      }))

      yield put({
        type: SAVE_TRANSACTIONS,
        transactions: transactions,
      })
    }
  }
}

export function* getTransactionsFromDB(action) {
  const { db, wallet, account } = action
  const dbIndex = "tx" + account.currency

  try {
    const fetchResult = yield call(() => db.get(dbIndex))

    yield put({
      type: SAVE_TRANSACTIONS,
      transactions: fetchResult.data,
    })

  } catch (error) {
    return null
  }
}

export function* getTransactionsFromServer(action) {
  yield put({
    type: SAVE_PAGE_STATE,
    pageState: PAGE_STATE.STATE_LOADING,
  })

  const { db, wallet, account, page, offset} = action
  const dbIndex = "tx" + account.currency

  const response = yield call(() => server.getTransactions(wallet, account, page, offset))

  try {
    if(response && response.status === 200) {
      const data = response.data.result
      let transactions = {}
      try {
        const fetchResult = yield call(() => db.get(dbIndex))

        transactions = fetchResult.data

      } catch (error) {
        console.log(error)
      }

      let i

      for(i=0; i < data.length; i++) {
        const newTransaction = {
          [data[i].hash]: {
            blockHash: data[i].blockHash,
            blockNumber: data[i].blockNumber,
            confirmations: data[i].confirmations,
            contractAddress: data[i].contractAddress,
            cumulativeGasUsed: data[i].cumulativeGasUsed,
            from: data[i].from,
            gas: data[i].gas,
            gasPrice: data[i].gasPrice,
            gasUsed: data[i].gasUsed,
            hash: data[i].hash,
            nonce: data[i].nonce,
            timeStamp: data[i].timeStamp,
            to: data[i].to,
            transactionIndex: data[i].transactionIndex,
            txreceipt_status: data[i].txreceipt_status,
            value: data[i].value,
            // input: data[i].input,
          }
        }

        transactions = Object.assign({}, transactions, newTransaction)
        // if(transactions.hasOwnProperty(newTransaction.hash)) {
        //   transactions = Object.assign({}, newTransaction, transactions)
        // } else {
        //   transactions = Object.assign(newTransaction, transactions)
        // }


      }
      yield call(saveTransactionsToDB, {
        db: db,
        wallet: wallet,
        account: account,
        transactions: transactions,
      })

      yield put({
        type: SAVE_PAGE_STATE,
        pageState: PAGE_STATE.STATE_LOADING_FINISH,
      })

      yield put({
        type: HIDE_PROCESSING_MODAL
      })
    }
  } catch(e) {

  }
}

export function* saveOneTransaction(action) {
  const { db, wallet, account, transaction } = action
  const dbIndex = "tx" + account.currency
  const transactionData = {
    [ transaction.hash ]: {
      blockHash: transaction.blockHash,
      blockNumber: transaction.blockNumber,
      confirmations: transaction.confirmations,
      contractAddress: transaction.contractAddress,
      cumulativeGasUsed: transaction.cumulativeGasUsed,
      from: transaction.from,
      gas: transaction.gas,
      gasPrice: transaction.gasPrice,
      gasUsed: transaction.gasUsed,
      hash: transaction.hash,
      nonce: transaction.nonce,
      timeStamp: transaction.timeStamp,
      to: transaction.to,
      transactionIndex: transaction.transactionIndex,
      txreceipt_status: transaction.txreceipt_status,
      value: transaction.value,
      // input: transaction.input,
    }
  }

  try {
    let newTransactions

    const fetchResult = yield call(() => db.get(dbIndex))
    const transactions = fetchResult.data


    newTransactions = Object.assign({}, transactions, transactionData)

    // if(transactions.hasOwnProperty(transaction.hash)) {
    //   newTransactions = Object.assign({}, transactionData, transactions, )
    // } else {
    //   newTransactions = Object.assign(transactionData, transactions)
    // }

    yield call(saveTransactionsToDB, {
      db: db,
      wallet: wallet,
      account: account,
      transactions: newTransactions,
    })

  } catch (error) {
    const { status } = error
    console.log(error)

    if(status === 404) {
      yield call(saveTransactionsToDB, {
        db: db,
        wallet: wallet,
        account: account,
        transactions: transactionData
      })
    }
  }
}

export function* getNextTransactionsOnlyState(action) {
  const { db, wallet, account, offset } = action
  const dbIndex = "tx" + account.currency
  //
  // const response = yield call(() => server.getTransactions(wallet, account, offset))
  //
  // if(response && response.status === 200) {
  //   const transactions = response.data
  //
  //   try {
  //     const fetchResult = yield call(() => db.get(dbIndex))
  //     const { transactions: originTransactions } = fetchResult.data
  //
  //     const newTransactions = Object.assign({}, originTransactions, transactions)
  //
  //     yield put({
  //       type: SAVE_TRANSACTIONS,
  //       transactions: newTransactions,
  //     })
  //
  //     yield put({
  //       type: SAVE_PAGE_STATE,
  //       pageState: PAGE_STATE.STATE_LOADING_NEXT_FINISH,
  //     })
  //   } catch (error) {
  //   }
  //
  //
  // }
}

const transactionsSagas = [
  takeEvery(SAVE_TRANSACTIONS_TO_DB, saveTransactionsToDB),
  takeEvery(GET_TRANSACTIONS_FROM_DB, getTransactionsFromDB),
  takeEvery(GET_TRANSACTIONS_FROM_SERVER, getTransactionsFromServer),
  takeEvery(SAVE_ONE_TRANSACTION, saveOneTransaction),
  takeEvery(GET_NEXT_TRANSACTIONS_ONLY_STATE, getNextTransactionsOnlyState),
]

export default transactionsSagas
