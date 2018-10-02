import React from 'react'
import Modal from 'react-native-modal'
import { TouchableWithoutFeedback, View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

class Notice extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalVisible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { profile } = nextProps

    if(profile && !profile.face_auth_enabled) {
      this.setState({
        isModalVisible: true,
      })
    }
  }

  render() {
    const { isModalVisible } = this.state

    return (
      <Modal 
        hideModalContentWhileAnimating={ true }
        useNativeDriver={ true }
        isVisible={ isModalVisible }>
        <View style={{ borderRadius: 8, flex: 0.5, backgroundColor: 'white', }}>
          <TouchableWithoutFeedback onPress={() => this.setState({ isModalVisible: false, })}>
            <Ionicons name='md-close' style={{ color: '#333333', fontSize: 36, position: 'absolute', top: 15, right: 15, }} />
          </TouchableWithoutFeedback>
          <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>얼굴 인식이 필요합니다.</Text>
          </View>
        </View>
      </Modal>
    )
  }
}

export default Notice
