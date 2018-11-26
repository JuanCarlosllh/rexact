import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import 'jest-dom/extend-expect'

import { Store, withStore } from '../src'

afterEach(cleanup)

const config = {
  state: {
    name: 'chuck',
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

const TestContainer = ({ store }) => (
  <div>
    <button data-testid="increment" onClick={() => store.commit('increment')} />
    <p data-testid="name">{store.state.name}</p>
    <p data-testid="counter">{store.state.count}</p>
    <p data-testid="expo">{store.getters.expo}</p>
    <button data-testid="decrement" onClick={() => store.commit('decrement')} />
  </div>
)
const Counter = withStore(TestContainer)

test('Check store state', () => {
  const { getByTestId } = render(
    <Store config={config}>
      <Counter />
    </Store>
  )
  expect(getByTestId('name').textContent).toBe(config.state.name)
  expect(getByTestId('counter').textContent).toBe('0')
})

test('Check store mutations', () => {
  const { getByTestId } = render(
    <Store config={config}>
      <Counter />
    </Store>
  )
  expect(getByTestId('counter').textContent).toBe('0')
  fireEvent.click(getByTestId('increment'))
  fireEvent.click(getByTestId('increment'))
  fireEvent.click(getByTestId('increment'))
  expect(getByTestId('counter').textContent).toBe('3')
  fireEvent.click(getByTestId('decrement'))
  expect(getByTestId('counter').textContent).toBe('2')
})

test('Check store getters', () => {
  const { getByTestId } = render(
    <Store
      config={{
        ...config,
        state: {
          ...config.state,
          count: 4
        }
      }}
    >
      <Counter />
    </Store>
  )
  expect(getByTestId('counter').textContent).toBe('4')
  expect(getByTestId('expo').textContent).toBe('16')
})
