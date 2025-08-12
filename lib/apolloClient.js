import { useMemo } from 'react'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import deepMerge from './deepMerge'

import { GRAPHQL_URL } from '../constants'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

const dataIdFromObject = (object) => {
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

let apolloClient

export function createCache() {
  return new InMemoryCache({
    possibleTypes: {
      Person: ['Parliamentarian', 'Guest'],
      Entity: [
        'Parliamentarian',
        'Organisation',
        'Guest',
        'LobbyGroup',
        'Branch',
      ],
    },
    dataIdFromObject,
  })
}

const withResponseInterceptor = (onResponse) =>
  new ApolloLink((operation, forward) => {
    return forward(operation).map((result) => {
      const context = operation.getContext()
      if (context.response) {
        onResponse(context.response)
      }
      return result
    })
  })

function createApolloClient({ headers = {}, onResponse } = {}) {
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    credentials: 'include',
    headers: {
      cookie: headers.cookie,
    },
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: onResponse
      ? ApolloLink.from([withResponseInterceptor(onResponse), httpLink])
      : httpLink,
    cache: createCache(),
  })
}

export function initializeApollo(initialState = null, options) {
  const _apolloClient = apolloClient ?? createApolloClient(options)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = deepMerge({}, initialState, existingCache)

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client, pageProperties) {
  if (pageProperties?.props) {
    pageProperties.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProperties
}

export function withInitialProps(Page) {
  const originalGetInitialProps = Page.getInitialProps

  Page.getInitialProps = async (ctx) => {
    const props = originalGetInitialProps ? originalGetInitialProps(ctx) : {}
    if (!process.browser) {
      const { getDataFromTree } = require('@apollo/client/react/ssr')
      const apolloClient = initializeApollo(null, {
        headers: ctx.req.headers,
        onResponse: (response) => {
          // headers.raw() is a node-fetch specific API and apparently the only way to get multiple cookies
          // https://github.com/bitinn/node-fetch/issues/251
          const cookies = response.headers.raw()['set-cookie']
          if (cookies) {
            ctx.res.setHeader('Set-Cookie', cookies)
          }
        },
      })
      const { AppTree } = ctx
      await getDataFromTree(
        <AppTree apolloClient={apolloClient} serverContext={ctx} />,
      )

      props[APOLLO_STATE_PROP_NAME] = apolloClient.cache.extract()
    } else {
      // client side apollo runs normally
      // https://nextjs.org/docs/messages/empty-object-getInitialProps
      props._skipEmptyWarning = true
    }
    return props
  }
  return Page
}

export function useApollo(pageProperties) {
  const state = pageProperties[APOLLO_STATE_PROP_NAME]
  return useMemo(() => initializeApollo(state), [state])
}
