import { locales } from '../constants'

import { addApolloState, initializeApollo } from './apolloClient'
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

    const apolloClient = initializeApollo()
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
