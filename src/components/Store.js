import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeLocalGetters } from './helpers'

export const AppContext = React.createContext({})

export class Store extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: props.config.state,
      commit: mutation => this.commit(mutation),
      getters: makeLocalGetters(props.config.getters, this) // not sure about this...
    }
  }

  update(newState) {
    this.setState(prevState => ({
      state: {
        ...prevState.state,
        ...newState
      }
    }))
  }

  commit(mutation) {
    this.props.config.mutations[mutation](this.state.state)
    this.update(this.state.state)
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

Store.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    state: PropTypes.object,
    mutations: PropTypes.object,
    getters: PropTypes.object
  })
}
