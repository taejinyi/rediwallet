import _ from 'lodash'
import React from 'react'
import {StyleSheet, View, Text, Image, Alert, TouchableWithoutFeedback, TouchableOpacity, AppState} from 'react-native'
import { MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons'
import { Container, Content, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
import { Header, WalletAccountList } from '../../components'
import {actions, sagas} from "../index";

import connect from "react-redux/es/connect/connect";
import {Currency, numberToString} from '../../utils'

import Wallet, {TRAFFIC_STATUS} from "../../system/Wallet"
import {translate} from "react-i18next";
import Modal from "react-native-modal";

@translate(['main'], { wait: true, })
class WalletPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isTrafficModalShow: false,
      appState: AppState.currentState
    }

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }
  renderStatusIcon = () => {
    const { t, i18n } = this.props
    const { iWallet } = this.props
    switch(iWallet.traffic) {
      case TRAFFIC_STATUS.PASSING:
        return (<View>
          <Text>
            <FontAwesome name='check-circle' style={{fontSize: 20, color: 'green',}}/>
            <Text style={{fontSize: 20, color: 'white',}}> {t(iWallet.rpc.name, { locale: i18n.language })}</Text>
          </Text>
        </View>)
      case TRAFFIC_STATUS.PAUSED:
        return (<View>
          <Text>
            <MaterialCommunityIcons size={ 20 } color='yellow' name='pause-octagon' />
            <Text style={{fontSize: 20, color: 'white',}}> {t(iWallet.rpc.name, { locale: i18n.language })}</Text>
          </Text>
        </View>)
      case TRAFFIC_STATUS.PENDING:
        return (<View>
          <Text>
            <MaterialCommunityIcons size={ 20 } color='grey' name='dots-horizontal-circle' />
            <Text style={{fontSize: 20, color: 'white',}}> {t(iWallet.rpc.name, { locale: i18n.language })}</Text>
          </Text>
        </View>)
      default:
        return (<View>
          <Text>
            <MaterialCommunityIcons size={ 20 } color='red' name='close-octagon' />
            <Text style={{fontSize: 20, color: 'white',}}> {t(iWallet.rpc.name, { locale: i18n.language })}</Text>
          </Text>
        </View>)
    }
  }

  renderTrafficModalContent = () => {
    const {db, t, i18n, iWallet} = this.props
    const ethDecimals = Math.pow(10, iWallet.getEthDecimals())
    const ethBalance = iWallet.getEthBalance() / ethDecimals
    const gasPrice = Math.floor(iWallet.gasPrice / Math.pow(10, 9))
    // const ethPrice = gasPrice * iWallet.get / Math.pow(10, 9)
    return (
      <View style={{ flex: 1, padding: 20, }}>
        <View style={{ marginTop: 5, flex: 0.1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}>
          <TouchableWithoutFeedback onPress={() => this.setState({ isTrafficModalShow: false, })}>
            <Feather name='x' style={{ fontSize: 32, color: '#303140', }} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => {
            this.setState({
              isTrafficModalShow: false,
            }, () => {
              this.refreshWallet().then()
            })
          }}>
            <MaterialCommunityIcons size={ 24 } color='#303140' name='refresh' />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center', }}>
          <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontSize: 16, color: '#666666' }}>
            { "ETH " + `${ numberToString(ethBalance) }`}
          </Text>
          {
            gasPrice ?

            (<Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontSize: 16, color: '#666666' }}>
              { `Gas Price = ${ numberToString(gasPrice) } gwei ` }
            </Text>) :
            (null)

          }
        </View>
      </View>


    )
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
      // console.log('App has come to the', nextAppState)
      clearInterval(this._interval);
      const { db, iWallet } = this.props
      this.props.saveWalletInstanceToDB(db, iWallet)
    }
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // console.log('App has come to the foreground!')
      this._interval = setInterval( () => {
        this.refreshWallet().then()
      }, 30000);
    }
    this.setState({appState: nextAppState});
  }


  async componentWillMount() {
    const { db, iWallet } = this.props
    this.props.getWalletFromNetwork(iWallet)
    this.logo = require('../../assets/images/logo_428x222.png')
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this._interval = setInterval( () => {
      this.refreshWallet().then()
    }, 30000);
  }

  async componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  refreshWallet = async () => {
    try {
      //TODO: avoid refreshWallet when other stuff going on
      // if (this.props.navigation.state.routeName === "Wallet") {
        const { db, iWallet } = this.props
        await this.props.getWalletFromNetwork(iWallet)
      // }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { navigation, t, i18n } = this.props
    const { iWallet } = this.props
    const { isTrafficModalShow } = this.state

    let currencyIcon, currencyName, totalAssetAmount = 0

    if (iWallet){
      if (iWallet.currency === "ETH") {
        currencyIcon = "ETH"
        currencyName = "Ethereum"
      } else if (iWallet.currency === "IFUM") {
        currencyIcon = "IFUM"
        currencyName = "Infleum"
      } else if (iWallet.currency === "KRWT") {
        currencyIcon = "￦"
        currencyName = "KRW Tether"
      } else {
        currencyIcon = "?"
        currencyName = "Unknown"
      }
      if (iWallet !== undefined) {
        totalAssetAmount = iWallet.getTotalAssetAmount()
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#303140', alignItems: 'center'}}>
        <Modal
          isVisible={ isTrafficModalShow }
          useNativeDriver={ true }
          hideModalContentWhileAnimating={ true }
          onBackdropPress={() => this.setState({ isTrafficModalShow: false, })}>
          <View style={{ flex: 0.69, borderRadius: 15, backgroundColor: 'white', }}>
            { this.renderTrafficModalContent() }
          </View>
        </Modal>
        <View style={{ flex: 0.3, width:'92%'}}>
          <View style={{ flex: 1, alignItems: 'flex-end', }}>
            <View style={{flexDirection: 'row', height: '100%', justifyContent: 'space-between', alignItems: 'flex-end', }}>
              <View style={{flex: 0.5, flexDirection: 'column'}} >
                <View style={{ flex: 0.3,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                  paddingTop: 40
                }}>
                  <TouchableOpacity
                    onPress={ () => this.debounceNavigate('NetworkSetting') }
                    style={{ paddingLeft: 0, paddingRight:10, paddingBottom: 7, paddingTop: 0}}>
                    { this.renderStatusIcon() }
                  </TouchableOpacity>

                </View>
                <View style={{ flex: 0.7,
                             justifyContent: 'flex-start',
                             alignItems: 'flex-end',
                             flexDirection: 'row'}}>
                  <Image style={{ height: 62, width: 120, alignItems: 'flex-end',  }} source={ this.logo } />
                </View>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}} >
                <View style={{alignItems: 'flex-end', width: '100%' }}>
                  <View>
                    <Text style={styles.TotalAsset}>{ t('totalAsset', { locale: i18n.language }) }</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontWeight: 'bold', color: 'white', marginBottom: 8,fontSize: 26 }}>{currencyIcon + " " + numberToString(totalAssetAmount)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Content style={{ backgroundColor: '#303140', width:'100%'}}>
          {
            (iWallet && iWallet.address !== undefined) ? (
              <View style={ styles.WalletAccountListContainer }>
                <WalletAccountList
                  currency={ iWallet.currency }
                  accounts={ iWallet.accounts }
                  fx={ iWallet.fx }
                  navigation={ navigation }
                />
              </View>
            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <MaterialCommunityIcons name='close-circle-outline' style={{ fontSize: 84, color: '#aaaaaa', }} />
                <Text style={{ fontSize: 18, marginTop: 10, color: '#aaaaaa', }}>
                  { t('loading', { locale: i18n.language }) }
                </Text>
              </View>
            )
          }
        </Content>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.3,
    height: '100%',
    flexDirection: 'column',
  },

  actionsWrapper: {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },

  iconsWrapper: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  titleTextWrapper: {
    flex: 0.3,
  },

  titleText: {
    fontSize: 24,
    color: 'white',
    marginLeft: '4%',
  },
  TotalAsset: {
    backgroundColor: 'transparent',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#D2D2D2',
    textAlign: 'right',
  },
  Currency: {
    fontSize:26,
    textAlign: "right",
    backgroundColor: 'transparent',
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  TotalAssetAmount: {
    backgroundColor: 'transparent',
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  searchContainer: {
    flex: 0.3,
    alignItems: 'center',
  },
  walletsPageContainer: {
    flex: 1,
  },

  walletsContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  WalletAccountListContainer: {
    width: '100%',
    height: '100%',
  }
})

const mapDispatchToProps = (dispatch) => ({
  // getWalletFromDB: (db) => dispatch(actions.getWalletFromDB(db)),
  showProcessingModal: (message) => dispatch(actions.showProcessingModal(message))
})

export default connect(null, mapDispatchToProps)(WalletPage)