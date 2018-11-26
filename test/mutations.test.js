import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import 'jest-dom/extend-expect'

import { Store, withStore } from '../src'

afterEach(cleanup)

test('Check store mutations', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <button
        data-testid="increment"
        onClick={() => store.commit('increment')}
      />
      <p data-testid="counter">{store.state.count}</p>
      <button
        data-testid="decrement"
        onClick={() => store.commit('decrement')}
      />
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: { count: 0 },
        mutations: {
          increment(state) {
            state.count++
          },
          decrement(state) {
            state.count--
          }
        }
      }}
    >
      <TestComponent />
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
