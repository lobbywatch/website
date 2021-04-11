import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ApolloProvider } from 'react-apollo'

import { locales } from '../constants'
import withApolloClient from '../lib/withApolloClient'
import NotFound from './404'

const WebApp = ({ Component, pageProps, apolloClient, serverContext }) => {
  const router = useRouter()

  return <ApolloProvider client={apolloClient}>
    <Head>
      <meta name='viewport' content='width=device-width,initial-scale=1' />
    </Head>
    {locales.includes(router.query.locale)
    ? <Component serverContext={serverContext} {...pageProps} />
    : <NotFound serverContext={serverContext} />}
  </ApolloProvider>
}

export default withApolloClient(WebApp)
