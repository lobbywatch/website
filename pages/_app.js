import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'

const WebApp = ({ Component, pageProps, apolloClient, serverContext }) => {
  const router = useRouter()
  const client = apolloClient || useApollo(pageProps)

  return <ApolloProvider client={client}>
    <Head>
      <meta name='viewport' content='width=device-width,initial-scale=1' />
    </Head>
    <Component serverContext={serverContext} {...pageProps} />
  </ApolloProvider>
}

export default WebApp
