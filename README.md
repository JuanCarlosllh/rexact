# What is Rexact

Rexact is a lightweight **state management library** for React applications based on [Vuex](https://vuex.vuejs.org/) pattern.

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

Now you can use the _withStore_ hight order component to acces the store

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

# Inspiration

**Rexact** was based on [Vuex](https://vuex.vuejs.org/) state management pattern and library

# License

MIT
