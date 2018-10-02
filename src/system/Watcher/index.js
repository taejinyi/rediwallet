import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Util, SecureStore } from 'expo'
import { FontAwesome } from '@expo/vector-icons'
import { RippleLoader } from 'react-native-indicator'
import { Alert, NetInfo, AppState, } from 'react-native'

import { actions } from 'rediwallet/src/pages'
import { NotificationSystem } from 'rediwallet/src/system'

import * as globals from 'rediwallet/src/globals'

class Watcher extends React.Component {
  constructor() {
    super()

    this.state = {
      appState: AppState.currentState,
      connectedWebSocket: null,
    }

    this.ws = null
  }

  _onWebSocketOpen = (event) => {
    return null
  }

  _onWebSocketMessage = (event) => {
    this.processWebSocketMessage(JSON.parse(event.data))
  }

  _onWebSocketError = async (event) => {
    const { db, saveToken, } = this.props

    if(event.message.indexOf('403') > -1) {
      try {
        this.closeWebSocket()

        await SecureStore.deleteItemAsync('token')
        await db.destroy()

        saveToken(undefined)
        await Util.reload()
      } catch (error) {
      }
    }
  }

  processWebSocketMessage = async (message_data) => {
    const { token } = this.state
    const { data, type, message } = message_data
    const { db, notificationSystem } = this.props

    if(message) {
      let iconComponent

      switch(type) {
        case 'transaction':
          iconComponent = <FontAwesome name='exchange' style={{ fontSize: 18, color: 'white', }} />
          break
        default:
          break
      }

      if(notificationSystem) {
        notificationSystem.addNotification({
          title: '알림',
          autoDismiss: 6,
          message: message,
          icon: iconComponent,
        })
      }
    }

    switch(type) {
      case 'wallet':
        const { saveWalletInformation, } = this.props
        saveWalletInformation(db, data.wallet)
        break
      case 'transaction':
        const { saveOneTransaction, getWalletInformationFromServer } = this.props

        saveOneTransaction(db, data.transaction)
        getWalletInformationFromServer(token, db)
        break
      case 'contact':
        const { addOneContact } = this.props
        const { contact } = data

        addOneContact(db, contact)
        break
      case 'union':
        const { saveUnion } = this.props
        const { color, ... rest } = data.union

        const newUnionInformation = {
          [ data.union.slug ]: {
            ... rest,
            groupColor: color,
          }
        }

        saveUnion(db, newUnionInformation)
      default:
        break
    }
  }

  connectWebSocket = (token) => {
    let ws = new WebSocket(
      globals.WEBSOCKET_URL,
      [],
      {
        headers: {
          token: token,
        }
      }
    )


    ws.onopen = this._onWebSocketOpen
    ws.onmessage = this._onWebSocketMessage
    ws.onerror = this._onWebSocketError

    this.ws = ws
  }

  closeWebSocket = () => {
    if(this.ws) {
      this.ws.close()
    }
  }

  componentWillUnmount() {
    this.closeWebSocket()
  }

  async componentDidMount() {
    const { db, token } = this.props

    AppState.addEventListener('change', this._handleAppStateChange)
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange)

    const isConnected = await NetInfo.isConnected.fetch()

    if(token && isConnected) {
      this.connectWebSocket(result)
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { token } = nextProps
    const isConnected = await NetInfo.isConnected.fetch()

    if(token && isConnected) {
      this.connectWebSocket(token)
    }
  }

  _handleAppStateChange = async (nextAppState) => {
    if(this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      const { token } = this.props
      const isConnected = await NetInfo.isConnected.fetch()

      if(token && isConnected) {
        this.connectWebSocket(token)
      }
    } else {
      this.closeWebSocket()
    }

    this.setState({
      appState: nextAppState
    })
  }

  _handleConnectivityChange = async (isConnected) => {
    if(isConnected) {
      const { token } = this.props

      if(token) {
        this.connectWebSocket(token)
      }
    } else {
      this.closeWebSocket()
    }
  }

  render() {
    return null
  }
}

Watcher.propTypes = {
  db: PropTypes.object,
  onTokenInvalid: PropTypes.func,
}

const dispatchToProps = (dispatch) => ({
  addOneContact: (db, contact) => dispatch(actions.addOneContact(db, contact)),
  getWalletInformationFromServer: (token, db) => dispatch(actions.getWalletInformationFromServer(token, db)),
  saveWalletInformation: (db, wallet_info) => dispatch(actions.saveWalletInformationToDB(db, wallet_info)),
  saveOneTransaction: (db, transaction) => dispatch(actions.saveOneTransaction(db, transaction)),
  saveUnion: (db, unions) => dispatch(actions.saveUnionsToDB(db, unions)),
  saveToken: (token) => dispatch(actions.saveToken(token)),
})

export default connect(null, dispatchToProps)(Watcher)
