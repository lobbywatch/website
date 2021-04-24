import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'

import { locales } from '../constants'
import NotFound from './404'

const WebApp = ({ Component, pageProps, apolloClient, serverContext }) => {
  const router = useRouter()
  const client = apolloClient || useApollo(pageProps)

  return <ApolloProvider client={client}>
    <Head>
      <meta name='viewport' content='width=device-width,initial-scale=1' />
    </Head>
    {locales.includes(router.query.locale) || router.isFallback
    ? <Component serverContext={serverContext} {...pageProps} />
    : <NotFound serverContext={serverContext} />}
  </ApolloProvider>
}

export default WebApp
