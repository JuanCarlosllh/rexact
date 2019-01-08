import React from 'react'
import { render, cleanup, fireEvent, wait } from 'react-testing-library'
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

test('Check actions with arguments', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="counter">{store.state.count}</p>
      <button
        data-testid="to10"
        onClick={() => store.dispatch('setCounter', 10)}
      />
      <button
        data-testid="to20"
        onClick={() => store.dispatch('setCounterWithObject', { n: 20 })}
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
          SetCount(state, n) {
            state.count = n
          }
        },
        actions: {
          setCounter(context, n) {
            context.commit('SetCount', n)
          },
          setCounterWithObject(context, { n }) {
            context.commit('SetCount', n)
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('counter').textContent).toBe('0')
  fireEvent.click(getByTestId('to10'))
  expect(getByTestId('counter').textContent).toBe('10')
  fireEvent.click(getByTestId('to20'))
  expect(getByTestId('counter').textContent).toBe('20')
})

test('Check action with Object-Style dispatch', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="counter">{store.state.count}</p>
      <button
        data-testid="to10"
        onClick={() => store.dispatch({ type: 'setCounter', n: 10 })}
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
          SetCount(state, n) {
            state.count = n
          }
        },
        actions: {
          setCounter(context, { n }) {
            context.commit('SetCount', n)
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('counter').textContent).toBe('0')
  fireEvent.click(getByTestId('to10'))
  expect(getByTestId('counter').textContent).toBe('10')
})

test('Check async action', async () => {
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
          asyncAction(context) {
            return new Promise(resolve => {
              setTimeout(() => {
                context.commit('increment')
                resolve()
              }, 100)
            })
          },
          increment(context) {
            context.dispatch('asyncAction').then(() => {
              context.commit('increment')
            })
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('counter').textContent).toBe('0')
  fireEvent.click(getByTestId('increment'))
  expect(getByTestId('counter').textContent).toBe('0')
  await wait(() => expect(getByTestId('counter').textContent).toBe('2'))
})

test('Check actions with modules', () => {
  const TestComponent = withStore(({ store }) => (
    <div>
      <p data-testid="globalCounter">{store.state.globalCount}</p>
      <p data-testid="localCounter">{store.state.counter.count}</p>
      <p data-testid="localName">{store.state.counter.name}</p>
      <button
        data-testid="incrementGlobal"
        onClick={() => store.dispatch('incrementGlobal')}
      />
      <button
        data-testid="incrementLocal"
        onClick={() => store.dispatch('counter/increment')}
      />
      <button
        data-testid="setNameAndIncrement"
        onClick={() => store.dispatch('counter/setNameAndIncrement')}
      />
    </div>
  ))
  const { getByTestId } = render(
    <Store
      config={{
        state: {
          globalCount: 0
        },
        mutations: {
          incrementGlobalCount(state) {
            state.globalCount++
          }
        },
        actions: {
          incrementGlobal(context) {
            context.commit('incrementGlobalCount')
          }
        },
        modules: {
          counter: {
            namespaced: true,
            state: {
              count: 0,
              name: 'Chuck'
            },
            mutations: {
              incrementLocalCounter(state, { n }) {
                state.count += n
              },
              changeNameTo(state, name) {
                state.name = name
              }
            },
            actions: {
              increment(context) {
                context.commit('incrementLocalCounter', { n: 5 })
              },
              changeName(context) {
                context.commit('changeNameTo', 'Norris')
              },
              setNameAndIncrement(context) {
                context.dispatch('increment')
                context.dispatch('changeName')
              }
            }
          }
        }
      }}
    >
      <TestComponent />
    </Store>
  )
  expect(getByTestId('globalCounter').textContent).toBe('0')
  expect(getByTestId('localCounter').textContent).toBe('0')
  expect(getByTestId('localName').textContent).toBe('Chuck')
  fireEvent.click(getByTestId('incrementGlobal'))
  fireEvent.click(getByTestId('incrementLocal'))
  expect(getByTestId('globalCounter').textContent).toBe('1')
  expect(getByTestId('localCounter').textContent).toBe('5')
  fireEvent.click(getByTestId('setNameAndIncrement'))
  expect(getByTestId('localCounter').textContent).toBe('10')
  expect(getByTestId('localName').textContent).toBe('Norris')
})
