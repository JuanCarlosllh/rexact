import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import 'jest-dom/extend-expect'

import { Store, withStore } from '../src'

afterEach(cleanup)

test('Check basic mutations', () => {
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

test('Check mutations with arguments', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="counter">{store.state.count}</p>
      <button
        data-testid="setCounterTo"
        onClick={() => store.commit('setCounterTo', 10)}
      />
      <button
        data-testid="setCounterToSum"
        onClick={() => store.commit('setCounterToSum', { n1: 10, n2: 20 })}
      />
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: { count: 0 },
        mutations: {
          setCounterTo(state, count) {
            state.count = count
          },
          setCounterToSum(state, { n1, n2 }) {
            state.count = n1 + n2
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('counter').textContent).toBe('0')
  fireEvent.click(getByTestId('setCounterTo'))
  expect(getByTestId('counter').textContent).toBe('10')
  fireEvent.click(getByTestId('setCounterToSum'))
  expect(getByTestId('counter').textContent).toBe('30')
})

test('Check mutations with Object-Style Commit', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="counter">{store.state.count}</p>
      <button
        data-testid="setCounterToSum"
        onClick={() =>
          store.commit({ type: 'setCounterToSum', n1: 10, n2: 20 })
        }
      />
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: { count: 0 },
        mutations: {
          setCounterToSum(state, { n1, n2 }) {
            state.count = n1 + n2
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('counter').textContent).toBe('0')
  fireEvent.click(getByTestId('setCounterToSum'))
  expect(getByTestId('counter').textContent).toBe('30')
})

test('Check mutations with modules', () => {
  const TestComponent = withStore(({ store }) => {
    return (
      <div>
        <p data-testid="name">{store.state.name}</p>
        <p data-testid="globalCount">{store.state.globalCount}</p>
        <p data-testid="count">{store.state.counter.count}</p>
        <button
          data-testid="increment"
          onClick={() => store.commit('counter/increment')}
        />
        <button
          data-testid="incrementGlobalCount"
          onClick={() => store.commit('incrementGlobalCount')}
        />
      </div>
    )
  })
  const { getByTestId } = render(
    <Store
      config={{
        state: {
          name: 'chuck',
          globalCount: 0
        },
        mutations: {
          incrementGlobalCount(state) {
            state.globalCount++
          }
        },
        modules: {
          counter: {
            namespaced: true,
            state: {
              count: 0
            },
            mutations: {
              increment(state) {
                state.count++
              }
            }
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )

  expect(getByTestId('name').textContent).toBe('chuck')
  expect(getByTestId('count').textContent).toBe('0')
  expect(getByTestId('globalCount').textContent).toBe('0')
  fireEvent.click(getByTestId('increment'))
  fireEvent.click(getByTestId('incrementGlobalCount'))
  expect(getByTestId('count').textContent).toBe('1')
  expect(getByTestId('globalCount').textContent).toBe('1')
})
