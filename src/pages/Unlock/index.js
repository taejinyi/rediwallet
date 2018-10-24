import React from 'react'
import { View } from 'react-native'
import { Container, Content } from 'native-base'
import { TextLoader } from 'react-native-indicator'

class UnlockPage extends React.Component {
  render() {
    return (
      <Container>
        <View style={{ flex: 1, }}>
          <TextLoader text='잠금해제페이지를 불러오는 중' textStyle={{ marginTop: 15, color: '#303140', fontSize: 17, }} />
        </View>
      </Container>
    )
  }
}

export default UnlockPage
