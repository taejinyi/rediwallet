import _ from 'lodash'
import React from 'react'
import { View, Text, TouchableWithoutFeedback, Clipboard } from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { Button, Container, Content, Footer, FooterTab, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import Modal from 'react-native-modal'
import { QRCode } from 'react-native-custom-qr-codes'
import {translate} from "react-i18next";
import Color from '../../constants/Colors'
import { TransactionList } from '../../components'
import {numberToString} from "../../utils/crypto";
import {PAGE_STATE} from "./actions";

@translate(['main'], { wait: true })
class WalletDetailPage extends React.Component {
  constructor(props) {
    super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })

    this.state = {
      isLoading: true,
      isSendModalVisible: false,
      isReceiveModalVisible: false,
      targetAddress: undefined,
      currentPage: 1,
      amount: 0,
      transactions: _.values(props.transactions).sort(this._compare),
      currency: this.props.navigation.state.params.account.currency
    }
    this.offset = 10
    // this.onEndReached = this.onEndReached.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    const { pageState, transactions } = nextProps
    // console.log('componentWillReceiveProps', pageState, transactions)

    switch(pageState) {
      case PAGE_STATE.STATE_LOADING_FINISH:
        this.setState({
          isLoading: false,
        })
        break
    }
    if(transactions) {
      this.setState({
        transactions: _.values(transactions).sort(this._compare),
      })
    }
  }

  showSendPage = () => {
    const account = this.props.navigation.state.params.account

    this.debounceNavigate('Send', {
      account: account,
    })
  }
  showReceiveModal = () => {
    this.setState({
      isReceiveModalVisible: true
    })
  }
  copyAddressToClipboard = () => {
    Clipboard.setString(this.props.wallet.address)
  }

  async componentWillMount() {
    const { account } = this.props.navigation.state.params
    const { db, wallet } = this.props.wallet
    const currency = this.props.navigation.state.params.account.currency
    let currencyIcon, currencyName, headerBackgroundColor, headerTitle
    if (currency) {
      if (currency === "ETH") {
        headerBackgroundColor = Color.ethereumColor
        currencyIcon = "ETH"
        currencyName = "Ethereum"
      } else if (currency === "IFUM") {
        headerBackgroundColor = Color.infleumColor
        currencyIcon = "IFUM"
        currencyName = "Infleum"
      } else if (currency === "KRWT") {
        headerBackgroundColor = Color.krwtColor
        currencyIcon = "￦"
        currencyName = "KRW Tether"
      } else {
        headerBackgroundColor = Color.backgroundColor
        currencyIcon = "?"
        currencyName = "Unknown"
      }
    } else {
      headerBackgroundColor = Color.backgroundColor
      headerTitle = "Loading..."
    }
    this.props.navigation.setParams({
      'headerBackgroundColor': headerBackgroundColor,
      'headerTitle': currencyName
    })
    this.headerBackgroundColor = headerBackgroundColor
    // await this.props.getTransactionsFromDB(db, this.props.navigation.state.params.wallet, this.props.navigation.state.params.account)
    await this.props.getTransactionsFromDB(db, wallet, account)
  }
  async componentDidMount() {
    this.refreshAccount()
    this._interval = setInterval( () => {
      this.refreshAccount()
    }, 30000);
  }

  async componentWillUnmount() {
    clearInterval(this._interval);
  }

  refreshAccount = () => {
    const { account } = this.props.navigation.state.params
    const { db, wallet } = this.props
    this.props.getTransactionsFromServer(db, wallet, account, 1, this.offset)
  }

  onEndReached = () => {
    try {
      const { db, wallet } = this.props
      const { account } = this.props.navigation.state.params
      console.log("in onEndReached", this.state.currentPage + 1, this.offset)
      this.props.getTransactionsFromServer(db, wallet, account, this.state.currentPage + 1, this.offset)
      this.setState({
        currentPage: this.state.currentPage + 1
      })

    } catch(e) {
      console.log('error in WDPage.onEndReached', e)
    }
  }

  render() {
    const { navigation, db, wallet, iWallet, t, i18n } = this.props
    const { transactions } = this.state
    const { account } = this.props.navigation.state.params
    let accountColor, currencyIcon, currencyName, currencyTicker, fxRate

    currencyIcon = iWallet.currency
    if (currencyIcon === "KRWT") {
      currencyIcon = "￦"
    }
    try {
      fxRate = iWallet.fx[account.address][iWallet.currencyAddress]
    } catch(e) {
      fxRate = 1
    }

    if (wallet){
      if (wallet.currency === "ETH") {
        currencyName = "Ethereum"
      } else if (wallet.currency === "IFUM") {
        currencyName = "Infleum"
      } else if (wallet.currency === "KRWT") {
        currencyName = "KRW Tether"
      } else {
        currencyName = "Unknown"
      }
    }
    currencyTicker = account.currency

    if (account.currency === "ETH") {
      accountColor = Color.ethereumColor
      currencyName = "Ethereum"
    } else if (account.currency === "IFUM") {
      accountColor = Color.infleumColor
      currencyName = "Infleum"
    } else if (account.currency === "KRWT") {
      accountColor = Color.krwtColor
      currencyName = "KRW Tether"
    } else {
      currencyName = "Unknown"
      accountColor = "#999999"
    }

    const balance = account.balance / Math.pow(10, account.decimals)

    let moneyStr = numberToString(balance)
    return (
      <View style={{ flex: 1, backgroundColor: '#303140', alignItems: 'center'}}>
        <View style={{ height: 140, width:'100%', backgroundColor: this.headerBackgroundColor, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ width:'90%', justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: '#aaaaaa' }}>
            <Button
              onPress={this.copyAddressToClipboard}
              transparent
              style={{ width:'100%', justifyContent: 'center', alignItems: 'center', marginTop:0, marginBottom: 0}}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ textAlign: 'center', color: 'white', fontSize: 12 }}>{ wallet.address }</Text>
            </Button>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14, marginTop: 0 }}>{ currencyIcon + " " + numberToString(fxRate) + " per " + currencyTicker }</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 18, marginTop: 10 }}>{ currencyTicker + " " + moneyStr }</Text>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 28 }}>{ " ~ " + currencyIcon + " " + numberToString(balance * fxRate) }</Text>
          </View>
        </View>
        <Modal
          hideModalContentWhileAnimating={ true }
          useNativeDriver={ true }
          isVisible={ this.state.isReceiveModalVisible }>
          <View style={{ borderRadius: 15, flex: 0.69, backgroundColor: 'white', }}>
            <TouchableWithoutFeedback onPress={() => this.setState({ isReceiveModalVisible: false, })}>
              <View style={{ padding:20 }}>
                <Text style={{ color: '#303140', fontSize: 20, fontWeight: 'bold', }}>X</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center', }}>
              <QRCode
                size={ 240 }
                content={ wallet.address }
                logoSize={ 40 }
                color='black'
                logo={ require('rediwallet/src/assets/images/logo_400x400.png') }
              />
              <Text style={{ color: '#303140', fontSize: 20, fontWeight: 'bold', }}>
                { t('showToReceive', { locale: i18n.language }) }
              </Text>
              <Button
                onPress={this.copyAddressToClipboard}
                transparent
                style={{ width:'100%', justifyContent: 'center', alignItems: 'center', marginTop:0, marginBottom: 0}}
              >
                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ textAlign: 'center', color: '#303140', fontSize: 12 }}>{ wallet.address }</Text>
              </Button>
            </View>
          </View>
        </Modal>
        <Content style={{ width: '100%', height: '100%' }}>
          {
            transactions ? (
              <View style={{ width: '100%', height: '100%' }}>
                <TransactionList
                  wallet={ wallet }
                  account={ account }
                  transactions={ transactions }
                  iWallet={ iWallet}
                  navigation={ navigation }
                  onEndReached={ this.onEndReached }
                />
              </View>
            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                <MaterialCommunityIcons name='close-circle-outline' style={{ fontSize: 84, color: '#aaaaaa', }} />
                <Text style={{ fontSize: 18, marginTop: 10, color: '#aaaaaa', }}>
                  { t('noTransactionYet', { locale: i18n.language }) }
                </Text>
              </View>
            )
          }
        </Content>
        <Footer>
          <FooterTab>
            <Button
              style={{  }}
              onPress={this.showSendPage}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#303140' }}>
                { t('send', { locale: i18n.language }) }
              </Text>
            </Button>
            <Button
              style={{  }}
              onPress={this.showReceiveModal}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#303140' }}>
                { t('receive', { locale: i18n.language }) }
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getTransactionsFromDB: (db, wallet, account) => dispatch(actions.getTransactionsFromDB(db, wallet, account)),
  getTransactionsFromServer: (db, wallet, account, page, offset) => dispatch(actions.getTransactionsFromServer(db, wallet, account, page, offset)),
})

export default connect(null, mapDispatchToProps)(WalletDetailPage)
