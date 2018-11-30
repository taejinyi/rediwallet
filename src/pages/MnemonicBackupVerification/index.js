import React from 'react'
import numeral from 'numeral'
import t from 'tcomb-form-native'
import { connect } from 'react-redux'
import { RippleLoader, TextLoader } from 'react-native-indicator'
import { Alert, StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native'

import { LoadingButton, DismissKeyboardViewHOC, Input } from '../../components'

import { numberToString } from '../../utils'
import {translate} from "react-i18next";

const Form = t.form.Form
const DismissKeyboardView = DismissKeyboardViewHOC(View)
import { NavigationActions } from 'react-navigation'
import {actions} from "../index";
import _ from "lodash";

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

    this.limitFormFields = t.struct({
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
            keyboardType='numeric'
            containerStyle={{ width: 130, }}
            textStyle={{ fontSize: 36, color: '#4BD160', }}
            onChangeText={ value => locals.onChange(numeral(value).format('0,000')) }
            value={ locals.value }
            type='custom'
          />
          <Text style={{ color: '#8E8E8E', fontWeight: 'bold', fontSize: 18, }}>만원</Text>
        </View>
      </View>
    )
  }

  _onFormSubmit = async () => {
    try {
      const { mnemonic } = this.props.navigation.state.params
      const { word1, word2 } = this.formElement.getValue()

      console.log(word1, word2)
      const sepMnemonics = mnemonic.split(' ');
      if (sepMnemonics[this.state.index1] === word1 && sepMnemonics[this.state.index2] === word2) {
        console.log("verified!!!")
      } else {
        console.log("invalid!!")
      }


    } catch(e) {
      console.log(e)

    }
  }

  renderSubmitButton = () => {
    const { word1, word2 } = this.state.formValue

    if((word1 && word2) &&
      (parseInt(word1.replace(',', '')) > 0 && parseInt(word2.replace(',', '')))) {
      return (
        <LoadingButton
          onPress={ this._onFormSubmit }
          Component={ TouchableOpacity }
          loadingView={ <RippleLoader size={ 16 } color='white' /> }>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', }}>
            한도 조절
          </Text>
        </LoadingButton>
      )
    }
  }

  render() {
    const { isLoading, word1, word2, formOptions, formValue } = this.state
    const { color } = this.props.navigation.state.params

    return (
      <DismissKeyboardView style={{ flex: 1, }}>
        <KeyboardAvoidingView keyboardVerticalOffset={ -144 } style={{ zIndex: -3, flex: 1, }} behavior='position'>
          <View style={{ padding: 30, }}>
            <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 30, }}>
              <View style={{ alignItems: 'flex-end', marginBottom: 15, }}>
                <Text style={{ color: '#8E8E8E', fontSize: 14, }}>
                  현재 그룹 한도
                </Text>
                {
                  word1 ? (
                    <Text style={{ fontSize: 18, color: '#666666', fontWeight: 'bold', }}>
                      { `${numberToString(word1)} 만원` }
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 18, color: '#666666', fontWeight: 'bold', }}>
                      설정 되어진 그룹 한도가 없습니다
                    </Text>
                  )
                }
              </View>
              <View style={{ alignItems: 'flex-end', marginBottom: 15, }}>
                <Text style={{ color: '#8e8e8e', fontSize: 14, }}>
                  현재 개인 한도
                </Text>
                {
                  word2 ? (
                    <Text style={{ fontSize: 18, color: '#666666', fontWeight: 'bold', }}>
                      { `${numberToString(word2)} 만원` }
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 18, color: '#666666', fontWeight: 'bold', }}>
                      설정 되어진 개인 한도가 없습니다
                    </Text>
                  )
                }
              </View>
            </View>
            <View style={{ justifyContent: 'flex-end', }}>
              <Text style={{ color: '#8E8E8E', fontSize: 18, }}>새 한도</Text>
              <Form
                value={ formValue }
                options={ formOptions }
                type={ this.limitFormFields }
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
    color: '#8e8e8e',
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
