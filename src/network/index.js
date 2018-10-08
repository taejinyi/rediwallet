import getBalance from './web3'
const DEBUG = false

let API_URL
let WEBSOCKET_URL

if(DEBUG) {
  API_URL = 'http://10.0.1.8:8000'
  WEBSOCKET_URL = 'ws://10.0.1.8:8000'
} else {
	API_URL = 'https://loom.socu.io/rpc'
  WEBSOCKET_URL = 'wss://loom.socu.io'
}

module.exports = {
  API_URL: API_URL,
  WEBSOCKET_URL: WEBSOCKET_URL,

  API_GET_PAYABLE: `${API_URL}/credit/payable/`,
}
