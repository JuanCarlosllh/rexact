import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import 'jest-dom/extend-expect'

import { Store, withStore } from '../src'

afterEach(cleanup)

test('Check basic action', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="counter">{store.state.count}</p>
      <button
        data-testid="increment"
        onClick={() => store.dispatch('increment')}
      />
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: {
          count: 0
        },
        mutations: {
          increment(state) {
            state.count++
          }
        },
        actions: {
          increment(context) {
            context.commit('increment')
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('counter').textContent).toBe('0')
  fireEvent.click(getByTestId('increment'))
  expect(getByTestId('counter').textContent).toBe('1')
})
