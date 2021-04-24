import {useMemo} from 'react'
import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client'
import {getDataFromTree} from '@apollo/client/react/ssr'
import deepMerge from './deepMerge'

import {GRAPHQL_URI} from '../constants'
import baseQueries from './baseQueries'
import {locales} from '../constants'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

const dataIdFromObject = object => {
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

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: GRAPHQL_URI,
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache({
      possibleTypes: {
        Person: ['Parliamentarian','Guest'],
        Entity: ['Parliamentarian','Organisation','Guest','LobbyGroup','Branch']
      },
      dataIdFromObject
    }),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

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

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export function withInitialProps(Page) {
  Page.getInitialProps = async ({ ctx, AppTree }) => {
    const apolloClient = initializeApollo()

    await getDataFromTree(
      <AppTree
        apolloClient={apolloClient}
        serverContext={ctx}
      />
    )

    return {
      [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract()
    }
  }
  return Page
}

export function createGetStaticProps({ pageQuery, getVariables, isNotFound, defaultLocale } = {}) {
  return async function getStaticProps({ params }) {
    const locale = params?.locale || defaultLocale
    if (!locales.includes(locale)) {
      return {
        notFound: true,
        props: {},
        revalidate: 60
      }
    }

    const apolloClient = initializeApollo()
    const datas = await Promise.all(
      baseQueries
        .map(query => ({
          query,
          variables: {
            locale
          }
        }))
        .concat(pageQuery ? {
          query: pageQuery,
          variables: {
            locale,
            ...getVariables ? getVariables({ params }) : undefined
          }
        } : [])
        .map(options => apolloClient.query(options))
    )

    return addApolloState(apolloClient, {
      notFound: isNotFound
        ? isNotFound(datas[datas.length - 1])
        : false,
      props: {},
      revalidate: 60,
    })
  }
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}
