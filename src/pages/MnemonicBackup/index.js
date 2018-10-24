import React from 'react'
import {Text, View, Clipboard} from 'react-native'
import {Button, Container, Content, Left, Right} from 'native-base'
import { TextLoader } from 'react-native-indicator'
import { NavigationActions } from 'react-navigation'
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
  render() {
    const { mnemonic } = this.props.navigation.state.params

    return (
      <Container>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <TextLoader text={mnemonic} textStyle={{ marginTop: 15, color: '#303140', fontSize: 17, }} />
          <Button
            onPress={this.copyToClipboard}
            transparent>
            <Text style={{ fontWeight: 'bold', color: '#303140' }}>Copy to Clipboard</Text>
          </Button>
          <Button
            onPress={this.closePage}
            transparent>
            <Text style={{ fontWeight: 'bold', color: '#303140' }}>Close</Text>
          </Button>
        </View>
      </Container>
    )
  }
}

export default MnemonicBackupPage
