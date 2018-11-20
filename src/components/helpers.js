export const makeLocalGetters = (getters = {}, namespace = []) => {
  const gettersProxy = {}

  const splitPos = namespace.length
  Object.keys(getters).forEach(type => {
    if (type.slice(0, splitPos) !== namespace) return
    const localType = type.slice(splitPos)
    Object.defineProperty(gettersProxy, localType, {
      get: () => getters[type],
      enumerable: true
    })
  })

  return gettersProxy
}
