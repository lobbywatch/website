import { locales } from '../constants'

import { addApolloState, initializeApollo } from './apolloClient'

export function createGetStaticProps({
  pageQuery,
  getVariables,
  getCustomStaticProps,
  defaultLocale,
  dataFetcher,
} = {}) {
  return async function getStaticProperties({ params }) {
    const locale = params?.locale || defaultLocale
    if (!locales.includes(locale)) {
      return {
        notFound: true,
      }
    }

    const apolloClient = initializeApollo()

    let data = { data: null }

    if (dataFetcher) {
      data = await dataFetcher(params)
    } else if (pageQuery) {
      data = await apolloClient.query({
        query: pageQuery,
        variables: {
          locale,
          ...(getVariables ? getVariables({ params }) : undefined),
        },
      })
    }

    return addApolloState(apolloClient, {
      props: {},
      revalidate: 60 * 3,
      ...(getCustomStaticProps
        ? await getCustomStaticProps(data, { params }, apolloClient)
        : { props: { data: data.data } }),
    })
  }
}
