import {ApolloClient} from '@apollo/client'
import {SchemaLink} from '@apollo/client/link/schema'
import {locales} from '../constants'
import {makeExecutableSchema} from 'graphql-tools'

import {createCache, addApolloState} from './apolloClient'
import baseQueries from './baseQueries'

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

    const apolloClient = new ApolloClient({
      ssrMode: true,
      link: new SchemaLink({
        schema: makeExecutableSchema({
          typeDefs: require('graphql/schema'),
          resolvers: require('graphql/resolvers'),
        }),
        context: () => ({
          loaders: require('graphql/loaders')()
        })
      }),
      cache: createCache(),
    })
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
