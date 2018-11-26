import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeLocalGetters } from './helpers'

export const AppContext = React.createContext({})

export class Store extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: props.config.state,
      commit: (mutation, ...args) => {
        if (typeof mutation === 'string') this.commit(mutation, ...args)
        else if (typeof mutation === 'object') {
          const { type, ...payload } = mutation // eslint-disable-line no-unused-vars
          this.commitWithObject(mutation.type, payload)
        }
      },
      getters: makeLocalGetters(props.config.getters, this), // not sure about this...
      dispatch: action => this.action(action)
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

  commit(mutation, ...args) {
    this.props.config.mutations[mutation](this.state.state, ...args)
    this.update(this.state.state)
  }

  commitWithObject(type, payload) {
    this.props.config.mutations[type](this.state.state, payload)
    this.update(this.state.state)
  }

  action(name) {
    this.props.config.actions[name]({
      state: this.state.state,
      commit: this.state.commit
    })
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
    getters: PropTypes.object,
    actions: PropTypes.object
  })
}
