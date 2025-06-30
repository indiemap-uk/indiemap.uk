import debug from 'debug'
import {once} from 'es-toolkit'
import * as zdb from 'zapatos/db'

const queryDebug = debug('indie:db:query')
const resultDebug = debug('indie:db:result')
const txnDebug = debug('indie:db:transaction')
const strFromTxnId = (txnId: number | undefined) => (txnId === undefined ? '-' : String(txnId))

export const getDb = once(() => {
  zdb.setConfig({
    queryListener: (query, txnId) => queryDebug(`(%s) %s\n%o`, strFromTxnId(txnId), query.text, query.values),
    resultListener: (result, txnId, elapsedMs) =>
      resultDebug(`(%s, %dms) %O`, strFromTxnId(txnId), elapsedMs?.toFixed(1), result),
    transactionListener: (message, txnId) => txnDebug(`(%s) %s`, strFromTxnId(txnId), message),
  })

  return zdb
})
