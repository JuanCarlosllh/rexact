import React from 'react'
import { render, cleanup } from 'react-testing-library'
import 'jest-dom/extend-expect'

import { Store, withStore } from '../src'

afterEach(cleanup)

test('Check store state', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="name">{store.state.name}</p>
      <p data-testid="counter">{store.state.count}</p>
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: {
          name: 'chuck',
          count: 0
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('name').textContent).toBe('chuck')
  expect(getByTestId('counter').textContent).toBe('0')
})
