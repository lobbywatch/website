import React from 'react'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'

const WebApp = ({ Component, pageProps, apolloClient, serverContext }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const client = apolloClient || useApollo(pageProps)

  return (
    <ApolloProvider client={client}>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
      </Head>
      <Component serverContext={serverContext} {...pageProps} />
    </ApolloProvider>
  )
}

export default WebApp
