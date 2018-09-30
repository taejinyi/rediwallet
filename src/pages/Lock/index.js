import React from 'react'
import { View, Modal } from 'react-native'
import { TextLoader } from 'react-native-indicator'

class LockPage extends React.Component {
  async componentWillMount() {


    if (await Expo.Fingerprint.hasHardwareAsync()) {
      if(await Expo.Fingerprint.isEnrolledAsync()) {
        const result = await Expo.Fingerprint.authenticateAsync()
        if (result.success) {
          this.props.saveUnlocked(true)
        } else {

        }

      } else {
        showPinNumberDialog = true
        console.log("Fingerprint is not enrolled")
        console.log(await Expo.Fingerprint.authenticateAsync())
      }
    }
    else {
      console.log("isUnlocked")
      console.log(await Expo.Fingerprint.hasHardwareAsync())
      console.log(await Expo.Fingerprint.isEnrolledAsync())
      console.log(await Expo.Fingerprint.authenticateAsync())
    }

  //
  // saveunlocked
  //   await SecureStore.('mnemonic')    SecureStore.
  //   if (this.props.mnekl)
  //   if (Expo.Fingerprint.hasHardwareAsync()) {
  //     Expo.Fingerprint.isEnrolledAsync()
  //   }
  //       await SecureStore.deleteItemAsync('mnemonic')


  }

  render() {

            {/*<DialogInput isDialogVisible={this.props.unLocked !== true}*/}
          {/*title={"Locked"}*/}
          {/*message={"Input pin number."}*/}
          {/*hintInput ={"6 digits"}*/}
          {/*submitInput={ (inputText) => {this.sendInput(inputText)} }*/}
          {/*closeDialog={ () => {this.showDialog(false)}}>*/}
        {/*</DialogInput>*/}

    return (
      <Modal>
        <View style={{ flex: 1, }}>
          <TextLoader text='잠금페이지를 불러오는 중' textStyle={{ marginTop: 15, color: '#10b5bc', fontSize: 17, }} />
        </View>
      </Modal>
    )
  }
}

export default LockPage
