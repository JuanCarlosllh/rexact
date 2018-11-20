import React from 'react'

import { AppContext } from './Store'

export const withStore = Component => props => (
  <AppContext.Consumer>
    {context => <Component {...props} store={context} />}
  </AppContext.Consumer>
)
