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

test('Check store state with modules', () => {
  const TestComponent = withStore(({ store }) => {
    return (
      <div>
        <p data-testid="name">{store.state.name}</p>
        <p data-testid="counter">{store.state.count}</p>
        <p data-testid="numTodos">{store.state.todos.numTodos}</p>
        <p data-testid="doneTodos">
          {store.state.todos.todos.reduce((acc, curr) => {
            if (curr.done) acc++
            return acc
          }, 0)}
        </p>
        <p data-testid="numUsers">{store.state.users.usersCount}</p>
        <p data-testid="subscriptions">
          {store.state.users.subscriptions.numSubscriptions}
        </p>
      </div>
    )
  })
  const { getByTestId } = render(
    <Store
      config={{
        state: {
          name: 'chuck',
          count: 0
        },
        modules: {
          todos: {
            namespaced: true,
            state: {
              todos: [{ done: false }, { done: true }, { done: false }],
              numTodos: 2
            }
          },
          users: {
            namespaced: true,
            state: {
              usersCount: 10
            },
            modules: {
              subscriptions: {
                namespaced: true,
                state: {
                  numSubscriptions: 20
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
  expect(getByTestId('name').textContent).toBe('chuck')
  expect(getByTestId('counter').textContent).toBe('0')
  expect(getByTestId('numTodos').textContent).toBe('2')
  expect(getByTestId('doneTodos').textContent).toBe('1')
  expect(getByTestId('numUsers').textContent).toBe('10')
  expect(getByTestId('subscriptions').textContent).toBe('20')
})
