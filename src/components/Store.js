import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  makeLocalGetters,
  generate,
  reduceStateByNamespace,
  reduceByNamespace
} from './helpers'

export const AppContext = React.createContext({})

export class Store extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: generate(props.config, 'state'),
      mutations: generate(props.config, 'mutations'),
      commit: (mutation, payload = {}) => {
        if (typeof mutation === 'string') this.commit(mutation, payload)
        else if (typeof mutation === 'object') {
          const { type, ...payload } = mutation // eslint-disable-line no-unused-vars
          this.commit(mutation.type, payload)
        }
      },
      getters: makeLocalGetters(props.config.getters, this), // not sure about this...
      dispatch: (action, payload = {}) => {
        if (typeof action === 'string') return this.dispah(action, payload)
        else if (typeof action === 'object') {
          const { type, ...payload } = action // eslint-disable-line no-unused-vars
          return this.dispah(action.type, payload)
        }
      }
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

  commit(mutation, payload) {
    const state = reduceStateByNamespace(mutation, this.state.state)
    const reducedMutation = reduceByNamespace(mutation, this.state.mutations)
    reducedMutation(state, payload)
    this.update(this.state.state)
  }

  dispah(name, payload) {
    return this.props.config.actions[name](
      {
        state: this.state.state,
        commit: this.state.commit,
        dispatch: this.state.dispatch
      },
      payload
    )
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
