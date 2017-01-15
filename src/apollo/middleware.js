import {applyMiddleware, compose} from 'redux'
import {IS_BROWSER} from './exenv'

const createMiddleware = (clientMiddleware) => {
  const middleware = applyMiddleware(clientMiddleware)
  if (IS_BROWSER && window.devToolsExtension) {
    return compose(middleware, window.devToolsExtension())
  }
  return middleware
}

export default createMiddleware
