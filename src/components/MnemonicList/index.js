import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Container, Content, } from 'native-base'
import { FlatList, Keyboard, View, Text, TextInput } from 'react-native'

class MnemonicList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputStatus: new Array(props.numberOfMnemonics),
      mnemonics: props.mnemonics,
    }
  }

  componentDidMount() {
  }
  renderItem = ({ item, index }) => {
    return (
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center', height: 40}}>
        <Text style={{ color: "white", fontSize: 16 }}>{(parseInt(index) + 1) + " : " + item.key}</Text>
      </View>
    )
  }

  _compare(a,b) {
    if (parseInt(a.index) < parseInt(b.index))
      return -1;
    if (parseInt(a.index) > parseInt(b.index))
      return 1;
    return 0;
  }

  render() {
    const { mnemonics } = this.props
    const { inputStatus, focusInput, } = this.state
    const sepMnemonics = mnemonics.split(' ');
    let objMap = {}
    sepMnemonics.forEach(function(obj, index) {
      objMap[index] = {
        index: index,
        key: obj
      };
    })
    const data = _.values(objMap)

    return (
      <View style={{ width: '100%', flex: 1, justifyContent: 'space-around', flexDirection: 'row', }}>
        <FlatList
          data={ data.sort(this._compare) }
          style={{flex: 1}}
          renderItem={this.renderItem}
          numColumns={3}
        />


      </View>
    )
  }
}

MnemonicList.defaultProps = {
  mnemonics: "",
  inputStyle: {
    width: 40,
    fontSize: 28,
    color: '#666666',
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 2,
  },
}

MnemonicList.propTypes = {
  mnemonics: PropTypes.string
}

export default MnemonicList
