import React from 'react'
import { render, cleanup } from 'react-testing-library'
import 'jest-dom/extend-expect'

import { Store, withStore } from '../src'

afterEach(cleanup)

test('Check store basic getters', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="expo">{store.getters.expo}</p>
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: { count: 4 },
        getters: {
          expo: state => state.count * state.count
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('expo').textContent).toBe('16')
})

test('Check store getters calling getters', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="duplicateExpo">{store.getters.duplicateExpo}</p>
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: {
          count: 4
        },
        getters: {
          expo: state => state.count * state.count,
          duplicateExpo: (state, getters) => getters.expo * 2
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('duplicateExpo').textContent).toBe('32')
})
