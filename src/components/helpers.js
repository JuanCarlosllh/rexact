export const generate = (m, k, stack = {}, rootStack = {}, deep = 0) => {
  if (m['modules']) {
    Object.keys(m['modules']).forEach(key => {
      const { mStack, mRootStack } = generate(
        m['modules'][key],
        k,
        stack[key],
        rootStack,
        deep + 1
      )
      stack[key] = mStack
      rootStack = mRootStack
    })
  }
  if (m[k]) {
    Object.keys(m[k]).forEach(key => {
      if (m.namespaced && deep !== 0) stack[key] = m[k][key]
      else rootStack[key] = m[k][key]
    })
  }
  if (deep === 0) {
    return {
      ...rootStack,
      ...stack
    }
  } else {
    return { mRootStack: rootStack, mStack: stack }
  }
}

export const makeLocalGetters = (getters = {}, parent) => {
  var gettersProxy = {}
  Object.keys(getters).forEach(type => {
    Object.defineProperty(gettersProxy, type, {
      get: () => getters[type](parent.state.state, parent.state.getters)
    })
  })
  return gettersProxy
}

export const reduceStateByNamespace = (namespace, obj) => {
  const tokens = namespace.split('/')
  if (tokens.length === 0) return obj
  else {
    tokens.pop()
    return tokens.reduce((acc, curr) => acc[curr], obj)
  }
}

export const reduceByNamespace = (namespace, obj) => {
  const tokens = namespace.split('/')
  if (tokens.length === 0) return obj
  else return tokens.reduce((acc, curr) => acc[curr], obj)
}
