import React from 'react'
import { View } from 'react-native'
import { Container, Content } from 'native-base'
import { TextLoader } from 'react-native-indicator'

class LandingPage extends React.Component {
  render() {
    return (
      <Container>
        <View style={{ flex: 1, }}>
          <TextLoader text='랜딩페이지를 불러오는 중' textStyle={{ marginTop: 15, color: '#10b5bc', fontSize: 17, }} />
        </View>
      </Container>
    )
  }
}

export default LandingPage
