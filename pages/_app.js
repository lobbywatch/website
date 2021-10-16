import React from 'react'
import Head from 'next/head'
import Script from 'next/script'

import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'

import { GA_TRACKING_ID } from '../constants'

const WebApp = ({ Component, pageProps, apolloClient, serverContext }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const client = apolloClient || useApollo(pageProps)

  return (
    <ApolloProvider client={client}>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
      </Head>
      <Component serverContext={serverContext} {...pageProps} />
      {!!GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy='afterInteractive'
          />
          <Script id='google-analytics' strategy='afterInteractive'>
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${GA_TRACKING_ID}', { 'anonymize_ip': true });
              `}
          </Script>
        </>
      )}
    </ApolloProvider>
  )
}

export default WebApp
