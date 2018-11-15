import React from 'react'
import {Text, View, Clipboard, Image} from 'react-native'
import {Button, Container, Content, FooterTab, Left, Right} from 'native-base'
import {RippleLoader, TextLoader} from 'react-native-indicator'
import { NavigationActions } from 'react-navigation'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import {translate} from "react-i18next";
import MnemonicList from "../../components/MnemonicList";
import LoadingButton from "../../components/LoadingButton";

@translate(['main'], { wait: true })
class MnemonicBackupPage extends React.Component {
  closePage = () => {
    const { dispatch } = this.props.navigation

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Main' })
      ]
    })
    dispatch(resetAction)
  }
  copyToClipboard = () => {
    Clipboard.setString(this.props.navigation.state.params.mnemonic)
  }
  async componentDidMount() {
    this.props.hideProcessingModal()

  }
  render() {
    const { mnemonic } = this.props.navigation.state.params
 		const { t, i18n } = this.props

    return (
      <Container>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#303140" }}>
          <View style={{ flex: 0.3, flexDirection: "row", alignItems: 'flex-end' }}>
              <Image style={{ height: 78, width: 150, alignItems: 'center' }} source={ require('rediwallet/src/assets/images/logo_428x222.png') } />
          </View>
          <View style={{ flex: 0.7, flexDirection: "row", width: '92%', alignItems: 'flex-end'}}>
            <View style={{padding: 10, width: '100%', marginBottom: "30%"}}>
              <MnemonicList style={{width: "100%"}} mnemonics={mnemonic} />
              <Button
                style={{ backgroundColor: "blue", width: '100%' }}
                onPress={this.copyToClipboard}
                transparent>
                <Text style={{ fontWeight: 'bold', color: 'white', width: '100%', textAlign: "center" }}>
                  {t('copy_to_clipboard', { locale: i18n.language })}
                </Text>
              </Button>
              {/*<LoadingButton*/}
                {/*isLoading={this.props.isLoading}*/}
                {/*full*/}
                {/*Component={ Button }*/}
                {/*onPress={this.closePage}*/}
                {/*loadingView={*/}
                  {/*<RippleLoader size={ 18 } color='white' />*/}
                {/*}*/}
                {/*style={{ marginTop: 30, backgroundColor: "gray", width: '100%' }}*/}
              {/*>*/}
                {/*<Text style={{ color: 'white', fontSize: 17, }}>*/}
                  {/*{t('close', { locale: i18n.language })}*/}
                {/*</Text>*/}
              {/*</LoadingButton>*/}
              <Button
                disabled={this.props.isLoading}
                style={{ marginTop: 30, backgroundColor: "gray", width: '100%' }}
                onPress={this.closePage}
                transparent>
                {
                  this.props.isLoading ? (
                    <Text style={{ color: 'white', fontSize: 17, width: '100%', textAlign: "center" }}>
                      {t('wait_for_wallet_generation', { locale: i18n.language })}
                    </Text>
                  ) : (
                    <Text style={{ color: 'white', fontSize: 17, width: '100%', textAlign: "center" }}>
                      {t('close', { locale: i18n.language })}
                    </Text>
                  )
                }
                  {/*<TextLoader text='Wait for wallet' textStyle={{ color: 'white', fontSize: 17, width: '100%', textAlign: "center" }} />*/}
              </Button>


            </View>
          </View>

        </View>
      </Container>
    )
  }
}
const mapDispatchToProps = (dispatch) => ({
  hideProcessingModal: () => dispatch(actions.hideProcessingModal()),
})

export default connect(null, mapDispatchToProps)(MnemonicBackupPage)
