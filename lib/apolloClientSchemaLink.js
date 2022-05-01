import { ApolloClient } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
import { locales } from '../constants'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { createCache, addApolloState } from './apolloClient'
import baseQueries from './baseQueries'

export function createGetStaticProps({
  pageQuery,
  getVariables,
  getCustomStaticProps,
  defaultLocale,
} = {}) {
  return async function getStaticProperties({ params }) {
    const locale = params?.locale || defaultLocale
    if (!locales.includes(locale)) {
      return {
        notFound: true,
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
          loaders: require('graphql/loaders')(),
        }),
      }),
      cache: createCache(),
    })
    const datas = await Promise.all(
      baseQueries
        .map((query) => ({
          query,
          variables: {
            locale,
          },
        }))
        .concat(
          pageQuery
            ? {
                query: pageQuery,
                variables: {
                  locale,
                  ...(getVariables ? getVariables({ params }) : undefined),
                },
              }
            : []
        )
        .map((options) => apolloClient.query(options))
    )

    return addApolloState(apolloClient, {
      props: {},
      revalidate: 60,
      ...(getCustomStaticProps
        ? await getCustomStaticProps(
            datas[datas.length - 1],
            { params },
            apolloClient
          )
        : undefined),
    })
  }
}
