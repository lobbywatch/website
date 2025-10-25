import Head from 'next/head'

import './font.css'
import { AppProps } from 'next/app'

const WebApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default WebApp
