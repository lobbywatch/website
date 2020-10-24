import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ApolloProvider } from 'react-apollo'

import withApolloClient from '../lib/withApolloClient'

class WebApp extends App {
  render () {
    const { Component, pageProps, apolloClient, serverContext } = this.props
    return <ApolloProvider client={apolloClient}>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
      </Head>
      <Component serverContext={serverContext} {...pageProps} />
    </ApolloProvider>
  }
}

export default withApolloClient(WebApp)
