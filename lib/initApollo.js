import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

import fetch from 'isomorphic-unfetch'

import { GRAPHQL_URI } from '../constants'

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

export const dataIdFromObject = object => {
  if (object.__typename) {
    if (object.id !== undefined) {
      return `${object.__typename}:${object.id}`
    }
    if (object._id !== undefined) {
      return `${object.__typename}:${object._id}`
    }
  }
  return null
}

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: require('./introspectionQueryResultData.json')
})

const createLink = (headers = {}) => {
  const http = new HttpLink({
    uri: GRAPHQL_URI
  })
  return http
}

function create (initialState = {}, headers = {}) {
  const link = createLink(headers)

  return new ApolloClient({
    connectToDevTools: process.browser,
    cache: new InMemoryCache({
      fragmentMatcher,
      dataIdFromObject
    }).restore(initialState || {}),
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link
  })
}

let globalApolloClient = null

export default function initApollo (initialState, headers) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, headers)
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = create(initialState, headers)
  }

  return globalApolloClient
}
