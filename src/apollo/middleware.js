import {applyMiddleware, compose} from 'redux'

const createMiddleware = (clientMiddleware) => {
  const middleware = applyMiddleware(clientMiddleware)
  if (process.browser && window.devToolsExtension) {
    return compose(middleware, window.devToolsExtension())
  }
  return middleware
}

export default createMiddleware
