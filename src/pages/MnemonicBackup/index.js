import React from 'react'
import {Text, View} from 'react-native'
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
  render() {
    const { mnemonic } = this.props
    return (
      <Container>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <TextLoader text={mnemonic} textStyle={{ marginTop: 15, color: '#10b5bc', fontSize: 17, }} />
          <Button
            onPress={this.closePage}
            transparent>
            <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>Close</Text>
          </Button>
        </View>
      </Container>
    )
  }
}

export default MnemonicBackupPage
