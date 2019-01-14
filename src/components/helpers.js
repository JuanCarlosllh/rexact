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

export const makeLocalGetters = (getters = {}, parent, namespace = null) => {
  const gettersProxy = {}
  Object.keys(getters).forEach(type => {
    if (getters[type] instanceof Function) {
      Object.defineProperty(gettersProxy, type, {
        get: () => {
          const state = namespace
            ? reduceStateByNamespace(`${namespace}/${type}`, parent.state.state)
            : parent.state.state
          return getters[type](state, parent.state.getters, parent.state.state)
        }
      })
    } else {
      gettersProxy[type] = makeLocalGetters(
        getters[type],
        parent,
        namespace ? `${namespace}/${type}` : type
      )
    }
  })
  return gettersProxy
}

export const getNamespace = namespace => {
  const tokens = namespace.split('/')
  if (tokens.length <= 1) return null
  else {
    tokens.pop()
    return tokens
  }
}
export const reduceStateByNamespace = (path, obj) => {
  const namespace = getNamespace(path)
  if (!namespace) return obj
  return namespace.reduce((acc, curr) => acc[curr], obj)
}

export const reduceByNamespace = (namespace, obj) => {
  const tokens = namespace.split('/')
  if (tokens.length === 0) return obj
  else return tokens.reduce((acc, curr) => acc[curr], obj)
}
