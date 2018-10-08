import React from 'react'
import Web3 from 'web3'

const chainId    = 'default'
const writeUrl   = 'https://loom.socu.io/rpc'
const readUrl    = 'https://loom.socu.io/query'

const withWeb3 = (Component) => {
  return class WrappedComponent extends React.Component {
    constructor() {
      super()

      this.state = {
        web3: undefined,
      }
    }

    async componentDidMount() {
      // const web3 = new PouchDB('REDIWALLETAPPDB')
      //
      // const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
      // web3 = new Web3()
      //
      // this.setState({
      //   web3: web3
      // })
    }

    render() {
      const { web3 } = this.state

      if(web3 === undefined) return null

      return <Component { ... this.props } web3={ web3 } />
    }
  }
}

export default withWeb3
