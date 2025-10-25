import Head from 'next/head'

import './font.css'

const WebApp = ({ Component, pageProps, serverContext }) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
      </Head>
      <Component serverContext={serverContext} {...pageProps} />
    </>
  )
}

export default WebApp
