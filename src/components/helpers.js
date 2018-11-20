export const makeLocalGetters = (getters = {}, parent) => {
  var gettersProxy = {}
  Object.keys(getters).forEach(type => {
    Object.defineProperty(gettersProxy, type, {
      get: () => getters[type](parent.state.state, parent.state.getters)
    })
  })
  return gettersProxy
}
