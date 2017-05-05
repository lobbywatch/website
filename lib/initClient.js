import {ApolloClient, createNetworkInterface} from 'react-apollo'
import {GRAPHQL_URI} from '../constants'

let apolloClient = null

function _initClient (headers, initialState) {
  return new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    dataIdFromObject: result => result.id || null,
    queryDeduplication: true,
    networkInterface: createNetworkInterface({
      uri: GRAPHQL_URI
    })
  })
}

export const initClient = (headers, initialState = {}) => {
  if (!process.browser) {
    return _initClient(headers, initialState)
  }
  if (!apolloClient) {
    apolloClient = _initClient(headers, initialState)
  }
  return apolloClient
}
