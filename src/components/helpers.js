export const generateState = (m, stack = {}, rootStack = {}, deep = 0) => {
  if (m['modules']) {
    Object.keys(m['modules']).forEach(key => {
      const { mStack, mRootStack } = generateState(
        m['modules'][key],
        stack[key],
        rootStack,
        deep + 1
      )
      stack[key] = mStack
      rootStack = mRootStack
    })
  }
  if (m.state) {
    Object.keys(m.state).forEach(key => {
      if (m.namespaced && deep !== 0) stack[key] = m.state[key]
      else rootStack[key] = m.state[key]
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

export const getNamespace = (namespace, modules) => {
  const tokens = namespace.split('/')
  if (tokens.length === 0) return modules.root
  else return tokens.reduce((acc, curr) => acc[curr], modules)
}
