import React from 'react'
import { mount, shallow } from 'enzyme'

import { Store, withStore } from '../src'

const config = {
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    }
  },
  getters: {
    expo(state) {
      return state.count * state.count
    }
  }
}

const counter = ({ store }) => (
  <div>
    <button onClick={() => store.commit('increment')}>+</button>
    <p>
      {store.state.count} / {store.getters.operation}
    </p>
    <button onClick={() => store.commit('decrement')}>-</button>
  </div>
)
export const Counter = withStore(counter)

const StoreWrapper = mount(<Store config={config} />)
const StoreTestWrapper = mount(
  <Store config={config}>
    <Counter id="counter" />
  </Store>
)

it('Store has state, commit and getters', () => {
  expect(StoreWrapper).toHaveState('state', { count: 0 })
  expect(StoreWrapper).toHaveState('commit')
  expect(StoreWrapper).toHaveState('getters')
})

it('withStore components has store', () => {
  const nCounter = StoreTestWrapper.find(counter)
  expect(nCounter).toHaveProp('store')
  expect(nCounter.props().store.state.count).toBe(0)
})
