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

test('Check getters with modules', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="expo">{store.getters.expo}</p>
      <p data-testid="sum">{store.getters.counter.sum}</p>
      <p data-testid="expoAndSum">{store.getters.counter.expoAndSum}</p>
      <p data-testid="sumLocal">{store.getters.counter.sumLocal}</p>
      <p data-testid="subcounter">
        {store.getters.counter.subCounter.sumSubcounter}
      </p>
      <p data-testid="subcounterRoot">
        {store.getters.counter.subCounter.sumSubcounter}
      </p>
      <p data-testid="sumAllCounters">
        {store.getters.counter.subCounter.sumAllCounters}
      </p>
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: { count: 4 },
        getters: {
          expo: state => state.count * state.count
        },
        modules: {
          counter: {
            namespaced: true,
            state: {
              localCount: 3
            },
            getters: {
              sum: (state, _, rootState) => rootState.count + rootState.count,
              expoAndSum: (state, getters, rootState) =>
                getters.expo + rootState.count,
              sumLocal: state => state.localCount + state.localCount
            },
            modules: {
              subCounter: {
                namespaced: true,
                state: {
                  subCounter: 50
                },
                getters: {
                  sumSubcounter: state => state.subCounter * 2,
                  sumAllCounters: (state, _, rootState) =>
                    state.subCounter +
                    rootState.count +
                    rootState.counter.localCount
                }
              }
            }
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('expo').textContent).toBe('16')
  expect(getByTestId('sum').textContent).toBe('8')
  expect(getByTestId('expoAndSum').textContent).toBe('20')
  expect(getByTestId('sumLocal').textContent).toBe('6')
  expect(getByTestId('subcounter').textContent).toBe('100')
  expect(getByTestId('sumAllCounters').textContent).toBe('57')
})
