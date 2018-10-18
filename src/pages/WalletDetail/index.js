import _ from 'lodash'
import React from 'react'
import { View, Text, TouchableWithoutFeedback, Clipboard } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Button, Container, Content, Footer, FooterTab, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
import { Util, SecureStore } from 'expo'
import { Header } from 'rediwallet/src/components'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import Modal from 'react-native-modal'
import { QRCode } from 'react-native-custom-qr-codes'
import {translate} from "react-i18next";

import { NavigationActions } from 'react-navigation'

@translate(['main'], { wait: true })
class WalletDetailPage extends React.Component {
  constructor(props) {
    super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })

    this.state = {
      transactions: undefined,
      isLoading: true,
      isSendModalVisible: false,
      isReceiveModalVisible: false,
      targetAddress: undefined,
      amount: 0,
      currency: this.props.navigation.state.params.wallet.currency
    }
  }

  renderQRCodeModalContent = () => {
    const {t, i18n} = this.props
    return (
      <View style={{ backgroundColor: 'white', flex: 0.25, }}>
        <TouchableWithoutFeedback onPress={() => {
          this.setState({
            isQRCodeModalShow: false
          }, () => {
            setTimeout(() => this.debounceNavigate('QRCodeScan'), 400)
          })
        }}>
          <View style={{ flexDirection: 'row', flex: 0.325, padding: 20, alignItems: 'center', }}>
            <Icon name='ios-camera' style={{ color: '#666666', }} />
            <Text style={{ color: '#666666', marginLeft: 8, }}>
              { t('scanQRCode', { lng: i18n.language }) }
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => {
          this.setState({
            isQRCodeModalShow: false,
          }, () => {
            setTimeout(() => {
              this.setState({
                isQRCodeShow: true,
              })
            }, 500)
          })
        }}>
          <View style={{ flexDirection: 'row', flex: 0.325, padding: 20, alignItems: 'center', }}>
            <FontAwesome name='qrcode' style={{ fontSize: 27, color: '#666666', }} />
            <Text style={{ color: '#666666', marginLeft: 10, }}>
              { t('myQRCode', { lng: i18n.language }) }
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.setState({ isQRCodeModalShow: false, })}>
          <View style={{ flex: 0.35, padding: 10, borderTopWidth: 1, borderColor: '#eaeaea', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#666666', }}>
              { t('cancel', { lng: i18n.language }) }
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  showSendPage = () => {
    this.debounceNavigate('Send', {wallet: this.props.navigation.state.params.wallet})
  }
  showReceiveModal = () => {
    this.setState({
      isReceiveModalVisible: true
    })
  }
  copyAddressToClipboard = () => {
    Clipboard.setString(this.props.navigation.state.params.wallet.address)
  }
  render() {

    const { navigation, wallets } = this.props
    const { wallet } = this.props.navigation.state.params
    console.log("WalletDetailPage")
    console.log(wallet)
    const { targetAddress, amount, currency } = this.state

    return (
      <View style={{ flex: 1, }}>
        <View style={{ flex: 0.3, }}>
          <Header
            headerTitle='Wallet'
            renderContent={ false }
          />
        </View>
        <Modal
          hideModalContentWhileAnimating={ true }
          useNativeDriver={ true }
          isVisible={ this.state.isSendModalVisible }>
          <View style={{ borderRadius: 8, flex: 0.5, backgroundColor: 'white', }}>
            <TouchableWithoutFeedback onPress={() => this.setState({ isSendModalVisible: false, })}>
              <View>
                <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>X</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center', }}>
              <Button
                style={{ marginTop: 200 }}
                onPress={this.scanQRCode}
                transparent>
                <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>Scan QRCode</Text>
              </Button>
              <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>
                Show to receive
              </Text>
              <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>
                Target: {targetAddress}
                Amount: {amount}
                Currency: {currency}
              </Text>
            </View>
          </View>
        </Modal>
        <Modal
          hideModalContentWhileAnimating={ true }
          useNativeDriver={ true }
          isVisible={ this.state.isReceiveModalVisible }>
          <View style={{ borderRadius: 8, flex: 0.5, backgroundColor: 'white', }}>
            <TouchableWithoutFeedback onPress={() => this.setState({ isReceiveModalVisible: false, })}>
              <View>
                <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>X</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center', }}>
              <QRCode
                size={ 240 }
                content={ wallet.address }
                logoSize={ 32 }
                color='black'
                logo={ require('rediwallet/src/assets/images/logo_428x222.png') }
              />
              <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>
                Show to receive
              </Text>
            </View>
          </View>
        </Modal>
        <Content style={{ backgroundColor: 'white', }}>
          <Text>Transactions of {wallet.address}</Text>
          <Text>Scanned Address : {targetAddress}</Text>
          <Text>Sent</Text>
          <Button
            style={{ marginTop: 200 }}
            onPress={this.copyAddressToClipboard}
            transparent>
            <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>Copy to Clipboard</Text>
          </Button>
        </Content>
        <Footer>
          <FooterTab>
            <Button
            style={{  }}
            onPress={this.showSendPage}
            transparent>
            <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>Send</Text>
          </Button>
          <Button
            style={{  }}
            onPress={this.showReceiveModal}
            transparent>
            <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>Receive</Text>
          </Button>
            {/*<LoadingButton*/}
              {/*full*/}
              {/*Component={ Button }*/}
              {/*onPress={ this._onFormSubmit }*/}
              {/*loadingView={ */}
                {/*<RippleLoader size={ 18 } color='white' />*/}
              {/*}*/}
              {/*style={ styles.buttonSubmit }>*/}
              {/*<Text style={{ color: 'white', fontSize: 17, }}>*/}
                {/*{ t('agree_and_signup', { locale: i18n.language }) }*/}
              {/*</Text>*/}
            {/*</LoadingButton>*/}
          </FooterTab>
        </Footer>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getWalletFromDB: (db, wallet) => dispatch(actions.getWalletFromDB(db, wallet)),
  getWalletFromNetwork: (db, wallet) => dispatch(actions.getWalletFromNetwork(db, wallet)),
})

export default connect(null, mapDispatchToProps)(WalletDetailPage)
