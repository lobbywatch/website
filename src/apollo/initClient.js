import ApolloClient, {createNetworkInterface} from 'apollo-client'
import {IS_SERVER} from './exenv'
import {GRAPHQL_URI} from '~/constants'

export const initClient = (headers) => {
  const client = new ApolloClient({
    ssrMode: IS_SERVER,
    headers,
    dataIdFromObject: (result) => {
      if (result.id) {
        return result.id
      }
      return null
    },
    networkInterface: createNetworkInterface({
      uri: GRAPHQL_URI
    })
  })
  if (IS_SERVER) {
    return client
  } else {
    if (!window.__APOLLO_CLIENT__) {
      window.__APOLLO_CLIENT__ = client
    }
    return window.__APOLLO_CLIENT__
  }
}
