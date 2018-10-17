import React from 'react'
import Modal from 'react-native-modal'
import { BarCodeScanner, Permissions } from 'expo'
import { Text, Dimensions, StatusBar, View, TouchableOpacity } from 'react-native'

class QRCodeScan extends React.Component {
  constructor() {
    super()

    this.state = {
      showModal: true,
      hasCameraPermission: null,
    }

    this.isScanned = false
  }

  requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted',
    })
  }

  async componentWillMount() {
    await this.requestCameraPermission()
  }

  _onPageClose = () => {
    this.setState({
      showModal: false,
    }, () => {
      this.props.navigation.goBack()
    })
  }

  _onQRCodeScan = ({ type, data }) => {
    this.isScanned = true

    this.setState({
      showModal: false,
    }, () => {
      const { navigation } = this.props
      navigation.goBack({ scannedAddress: data })
    })
  }

  componentWillReceiveProps(nextProps) {
    const { showModal } = this.state

    // TODO
  }

  render() {
    const { showModal, hasCameraPermission } = this.state
    const { width, height } = Dimensions.get('window')

    const scannerStyle = {
      width: width,
      height: height,
    }

    return (
      <View style={{ flex: 1, }}>
        { 
          hasCameraPermission === null ? (
            null
          ) : (
            <View style={{ flex: 1, }}>
              <BarCodeScanner
                style={ scannerStyle }
                onBarCodeRead={ !this.isScanned ? this._onQRCodeScan : null }>
              </BarCodeScanner>
              <Modal 
                animationInTiming={ 1 }
                animationOutTiming={ 1 }
                isVisible={ showModal }
                backdropOpacity={ 0.5 }
                style={{ paddingTop: 20, }}>
                <View style={{ flex: 1, }}>
                  <View style={{ zIndex: 999, position: 'absolute', }}>
                    <TouchableOpacity onPress={ this._onPageClose }>
                      <Text style={{ color: 'white', fontSize: 16, }}>닫기</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <View>
                      {
                        this.isScanned === true ? (
                          <Text style={{ marginBottom: 80, color: 'white', fontSize: 22, }}>
                            스캔 되었습니다!
                          </Text>
                        ) : (
                          <Text style={{ marginBottom: 80, color: 'white', fontSize: 22, }}>
                            QR코드를 스캔해 주세요
                          </Text>
                        )
                      }
                    </View>
                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', width: scannerStyle.width / 1.3, height: scannerStyle.height / 2.3, }}>
                      <View style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 10, borderLeftWidth: 1, borderTopWidth: 1, borderColor: 'white', }} />
                      <View style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRightWidth: 1, borderTopWidth: 1, borderColor: 'white', }} />
                      <View style={{ position: 'absolute', bottom: 0, left: 0, width: 10, height: 10, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: 'white', }} />
                      <View style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRightWidth: 1, borderBottomWidth: 1, borderColor: 'white', }} />
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )
        }
      </View>
    )
  }
}

export default QRCodeScan
