import React from 'react'
import t from 'tcomb-form-native'
import { connect } from 'react-redux'
import { RippleLoader, TextLoader } from 'react-native-indicator'
import { Alert, StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native'
import platform from '../../native-base-theme/variables/platform'
import getTheme from '../../native-base-theme/components'

import { LoadingButton, DismissKeyboardViewHOC, Input } from '../../components'

import {translate} from "react-i18next";

const Form = t.form.Form
const DismissKeyboardView = DismissKeyboardViewHOC(View)
import { NavigationActions } from 'react-navigation'
import {actions} from "../index";
import _ from "lodash";
import {Body, Header, Icon, Left, Right, StyleProvider, Title} from "native-base";
import {SecureStore} from "expo";

@translate(['main'], { wait: true })
class MnemonicBackupVerificationPage extends React.Component {

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

  constructor(props) {
    super(props)
    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })

    this.formFields = t.struct({
      word1: t.String,
      word2: t.String,
    })
    let index1 = null, index2 = null
    while (index1 === index2) {
      index1 = Math.floor((Math.random() * 12)) + 1;
      index2 = Math.floor((Math.random() * 12)) + 1;
    }

    if (index1 > index2) {
      const tmp = index2
      index2 = index1
      index1 = tmp
    }

    this.state = {
      formOptions: {
        fields: {
          word1: {
            label: props.t(`${index1}thWord`, { locale: props.i18n.language }),
            template: this.customTemplateForInput,
          },
          word2: {
            label: props.t(`${index2}thWord`, { locale: props.i18n.language }),
            template: this.customTemplateForInput,
          },
        }
      },
      formValue: {
        word1: null,
        word2: null,
      },
      index1: index1,
      index2: index2,
      isLoading: false,
    }

    this.formElement = null
  }

  async componentWillMount() {
    const { slug } = this.props.navigation.state.params
  }

  customTemplateForInput = (locals) => {
    return (
      <View style={{ height: 100, marginTop: 30, }}>
        <Text style={ locals.hasError ? styles.textErrorDesc : styles.textDesc }>{ locals.label }</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Input
            underlineColor={ locals.hasError ? '#e75a5a' : '#dadada' }
            underlineHoverColor='#aaaaaa'
            keyboardType='default'
            containerStyle={{ width: 130, }}
            textStyle={{ fontSize: 36, color: '#303140', }}
            autoCapitalize="none"
            onChangeText={ value => locals.onChange(value) }
            value={ locals.value }
            type='custom'
          />
          {/*<Text style={{ color: '#8E8E8E', fontWeight: 'bold', fontSize: 18, }}>만원</Text>*/}
        </View>
      </View>
    )
  }

  _onFormSubmit = async () => {
    try {
      const { t, i18n } = this.props
      const { mnemonic } = this.props.navigation.state.params
      const { word1, word2 } = this.formElement.getValue()

      const sepMnemonics = mnemonic.split(' ');
      if (sepMnemonics[this.state.index1 - 1] === word1 && sepMnemonics[this.state.index2 - 1] === word2) {

        await SecureStore.setItemAsync('backupVerified', "verified")

        Alert.alert(
          t('backupVerified', { locale: i18n.language }),
          t('backupVerifiedDesc', { locale: i18n.language }),
          [
            { text: 'OK', onPress: () => {
              this.closePage()
            }}
          ],
          { cancelable: false}
        )
      } else {
        Alert.alert(
          t('backupVerificationFailed', { locale: i18n.language }),
          t('backupVerificationFailedDesc', { locale: i18n.language }),
          [
            { text: 'OK', onPress: () => {
            }}
          ],
          { cancelable: false}
        )
      }


    } catch(e) {
      console.log(e)

    }
  }

  renderSubmitButton = () => {
    const { word1, word2 } = this.state.formValue
    const { t, i18n } = this.props

    if((word1 && word2)) {
      return (
        <LoadingButton
          onPress={ this._onFormSubmit }
          Component={ TouchableOpacity }
          loadingView={ <RippleLoader size={ 16 } color='white' /> }>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', }}>
            {t('verify', { locale: i18n.language })}
          </Text>
        </LoadingButton>
      )
    }
  }

  render() {
    const { formOptions, formValue } = this.state
    const { t, i18n } = this.props

    return (
      <DismissKeyboardView style={{ flex: 1, }}>
        <StyleProvider style={ getTheme(platform) }>
          <Header
            iosBarStyle='light-content'
            style={{ backgroundColor: "#303140", }}>
            <Left>
              <TouchableOpacity onPress={() => {
                const { navigation } = this.props
                navigation.goBack()
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <Icon name='ios-arrow-back' style={{ color: 'white', fontSize: 20, marginRight: 5, }} />
                  <Text style={{ color: 'white', fontSize: 18, }}>
                    {t('cancel', { locale: i18n.language })}
                  </Text>
                </View>
              </TouchableOpacity>
            </Left>
            <Body>
              <Title style={{ color: 'white', }}>
                {t('backupVerification', { locale: i18n.language })}
              </Title>
            </Body>
            <Right>
              { this.renderSubmitButton() }
            </Right>
          </Header>
        </StyleProvider>

        <KeyboardAvoidingView keyboardVerticalOffset={ 0 } style={{ zIndex: -3, flex: 1, }} behavior='padding'>
          {/*//-144*/}
          <View style={{ padding: 30, }}>
            <View style={{ justifyContent: 'flex-end', }}>
              {/*<Text style={{ color: '#8E8E8E', fontSize: 18, }}>새 한도</Text>*/}
              <Form
                value={ formValue }
                options={ formOptions }
                type={ this.formFields }
                ref={ el => this.formElement = el }
                onChange={ value => { this.setState({ formValue: { ... value } })}}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </DismissKeyboardView>
    )
  }
}

const styles = StyleSheet.create({
  textDesc: {
    color: '#303140',
    fontSize: 16,
  },

  textErrorDesc: {
    color: '#e75a5a',
    fontSize: 16,
  },
})

const mapDispatchToProps = (dispatch) => ({
  hideProcessingModal: () => dispatch(actions.hideProcessingModal()),
})

export default connect(null, mapDispatchToProps)(MnemonicBackupVerificationPage)
