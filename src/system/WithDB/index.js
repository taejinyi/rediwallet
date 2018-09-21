import React from 'react'
import { FileSystem } from 'expo'
import PouchDB from 'pouchdb-react-native'

const withDB = (Component) => {
  return class WrappedComponent extends React.Component {
    constructor() {
      super()

      this.state = {
        db: undefined,
      }
    }

    async componentDidMount() {
      const db = new PouchDB('REDIWALLETAPPDB')

      this.setState({
        db: db
      })
    }

    render() {
      const { db } = this.state

      if(db === undefined) return null

      return <Component { ... this.props } db={ db } />
    }
  }
}

export default withDB
