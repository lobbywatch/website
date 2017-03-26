import ApolloClient, {createNetworkInterface} from 'apollo-client'
import {GRAPHQL_URI} from '../constants'

export const initClient = (headers) => {
  const client = new ApolloClient({
    ssrMode: !process.browser,
    dataIdFromObject: (result) => {
      return null
    },
    queryDeduplication: true,
    networkInterface: createNetworkInterface({
      uri: GRAPHQL_URI
    })
  })
  if (!process.browser) {
    return client
  } else {
    if (!window.__APOLLO_CLIENT__) {
      window.__APOLLO_CLIENT__ = client
    }
    return window.__APOLLO_CLIENT__
  }
}
