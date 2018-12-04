[![Build Status](https://travis-ci.org/JuanCarlosllh/rexact.svg?branch=master)](https://travis-ci.org/JuanCarlosllh/rexact)

**This library is under development and is not ready to be used in production**.

Rexact docs are for now a slightly modified copy of [Vuex official docs](https://vuex.vuejs.org/guide/) since rexact api basically reimplements Vuex for react (in the same way Vuex does with Vue).

# What is Rexact

Rexact is a [lightweight](https://bundlephobia.com/result?p=rexact) **state management library** for React applications based on [Vuex](https://vuex.vuejs.org/) pattern.

# Table of contents

- [What is Rexact](#what-is-rexact)
- [Table of contents](#table-of-contents)
- [Status Progress](#status-progress)
- [Installation](#installation)
  - [NPM](#npm)
  - [Yarn](#yarn)
- [Getting Started](#getting-started)
  - [The simplest Store](#the-simplest-store)
- [Core Concepts](#core-concepts)
  - [State](#state)
  - [Getters](#getters)
  - [Mutations](#mutations)
    - [Commit with Payload](#commit-with-payload)
    - [Object-Style Commit](#object-style-commit)
  - [Actions](#actions)
    - [Dispatching Actions](#dispatching-actions)
    - [Composing Actions](#composing-actions)
- [Inspiration](#inspiration)
- [License](#license)

  <!--te-->

# Status Progress

- [ ] Store
  - [x] State
  - [x] Getters
  - [x] Mutations
  - [x] Actions
  - [ ] Modules
- [ ] Helpers
  - [ ] mapState
  - [ ] mapGetters
  - [ ] mapMutations
  - [ ] mapActions
- [ ] React
  - [x] withStore Higher-Order component
  - [ ] StoreProvider component with render props
  - [ ] useStore Hook
- [ ] Plugins
  - [ ] Plugin Support
  - [ ] Logger Plugin
  - [ ] Redux Devtools plugin
- [ ] Strict mode
- [ ] Hot reloading mutations
- [ ] Docs

# Installation

This assumes that you’re using npm or yarn with a module bundler like webpack

## NPM

```
npm install rexact --save
```

## Yarn

```
yarn add rexact
```

Then you can directly import rexact componets:

```javascript
import { Store } from 'rexact'
```

# Getting Started

## The simplest Store

First, create your store configuration. It is pretty straightforward, just provide an initial state object, and some mutations. Then pass the store configuration to rexact Store component.

```javascript
// App.js
import { Store } from 'rexact'
import Counter from './Counter'

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
  }
}

const App = () => (
  <div className="App">
    <Store config={config}>
      <Counter />
    </Store>
  </div>
)
```

Now you can use the _withStore_ high order component to acces the store

```javascript
// Counter.js
import React from 'react'
import { withStore } from 'rexact'

const counter = ({ store }) => (
  <div className="counter">
    <button onClick={() => store.commit('increment')}>+</button>
    <p>{store.state.count}</p>
    <button onClick={() => store.commit('decrement')}>-</button>
  </div>
)

export const Counter = withStore(counter)
```

# Core Concepts

## State

Rexact uses a **Single state tree** - that is, this single object contains all your application level state and serves as the "single source of truth".

Let's create a very siple store with a counter state:

```javascript
const config = {
  state: { count: 0 }
}
const Counter = withStore(({ store }) => <div>{store.state.count}</div>)
const App = () => (
  <Store config={config}>
    <Counter />
  </Store>
)
```

Whenever store.state.count changes, it will automatically update the Counter component.

## Getters

Sometimes we may need to compute derived state based on store state, for example filtering through a list of items and counting them:

```javascript
const Todos = ({ store }) => {
  const doneTodosCount = store.state.todosfilter(todo => todo.done).length
  return <div>Done todos: {doneTodosCount}</div>
}
```

If more than one component needs to make use of this, we have to either duplicate the function, or extract it into a shared helper and import it in multiple places - both are less than ideal.

Rexact allows us to define "getters" in the store, so we can easily reuse these functions.

Getters will receive the state as their 1st argument:

```javascript
// Store config
const config = {
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
}
```

```javascript
// Todos.js
const Todos = ({ store }) => (
  <div>Done todos: {store.getters.doneTodosCount}</div>
)
```

## Mutations

The only way to actually change state in a Rexact store is by committing a mutation. Rexact mutations are very similar to events: each mutation has a string type and a handler. The handler function is where we perform actual state modifications, and it will receive the state as the first argument:

```javascript
const config = {
  state: {
    count: 1
  },
  mutations: {
    increment(state) {
      // mutate state
      state.count++
    }
  }
}
```

You cannot directly call a mutation handler. Think of it more like event registration: "When a mutation with type increment is triggered, call this handler." To invoke a mutation handler, you need to call store.commit with its type:

```javascript
const Counter = ({ store }) => (
  <div>
    <button onClick={() => store.commit('increment')} />+</button>
    <p>{store.state.count}</p>
  </div>
)
```

### Commit with Payload

You can pass an additional argument to store.commit, which is called the payload for the mutation:

```javascript
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

```javascript
store.commit('increment', 10)
```

### Object-Style Commit

An alternative way to commit a mutation is by directly using an object that has a type property:

```javascript
store.commit({
  type: 'increment',
  amount: 10
})
```

When using object-style commit, the entire object will be passed as the payload to mutation handlers, so the handler remains the same:

```javascript
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

## Actions

Actions are similar to mutations, the differences being that:

- Instead of mutating the state, actions commit mutations.
- Actions can contain arbitrary asynchronous operations.

```javascript
config = {
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
}
```

Action handlers receive a context object which exposes the same set of methods/properties on the store instance, so you can call context.commit to commit a mutation, or access the state and getters via context.state and context.getters. We can even call other actions with context.dispatch

```javascript
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Dispatching Actions

Actions are triggered with the store.dispatch method:

```javascript
store.dispatch('increment')
```

We can perform asynchronous operations inside an action:

```javascript
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Actions support the same payload format and object-style dispatch:

```javascript
// dispatch with a payload
store.dispatch('incrementAsync', {
  amount: 10
})

// dispatch with an object
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

### Composing Actions

Actions are often asynchronous, so how do we know when an action is done? And more importantly, how can we compose multiple actions together to handle more complex async flows?

The first thing to know is that store.dispatch can handle Promise returned by the triggered action handler and it also returns Promise:

```javascript
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Now you can do:

```javascript
store.dispatch('actionA').then(() => {
  // ...
})
```

And also in another action:

```javascript
actions: {
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Finally, if we make use of async / await, we can compose our actions like this:

```javascript
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // wait for `actionA` to finish
    commit('gotOtherData', await getOtherData())
  }
}
```

# Inspiration

**Rexact** was based on [Vuex](https://vuex.vuejs.org/) state management pattern and library

# License

MIT
