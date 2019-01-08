import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  makeLocalGetters,
  generate,
  getNamespace,
  reduceStateByNamespace,
  reduceByNamespace
} from './helpers'

export const AppContext = React.createContext({})

export class Store extends Component {
  constructor(props) {
    const modularState = generate(props.config, 'state')
    const modularMutations = generate(props.config, 'mutations')
    const modularGetters = generate(props.config, 'getters')
    const modularActions = generate(props.config, 'actions')
    super(props)
    this.state = {
      state: modularState,
      mutations: modularMutations,
      actions: modularActions,
      commit: (mutation, payload = {}) => {
        if (typeof mutation === 'string') this.commit(mutation, payload)
        else if (typeof mutation === 'object') {
          const { type, ...payload } = mutation // eslint-disable-line no-unused-vars
          this.commit(mutation.type, payload)
        }
      },
      getters: makeLocalGetters(modularGetters, this), // not sure about this...
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

  dispah(action, payload) {
    const state = reduceStateByNamespace(action, this.state.state)
    const reducedAction = reduceByNamespace(action, this.state.actions)
    const namespace = getNamespace(action)
    return reducedAction(
      {
        state: state,
        commit: (localMoutation, localPayload) =>
          namespace
            ? this.state.commit(`${namespace}/${localMoutation}`, localPayload)
            : this.state.commit(localMoutation, localPayload),
        dispatch: (localAction, localPayload) =>
          namespace
            ? this.state.dispatch(`${namespace}/${localAction}`, localPayload)
            : this.state.dispatch(localAction, localPayload),
        rootState: this.state.state
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
