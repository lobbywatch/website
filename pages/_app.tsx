import Head from 'next/head'

import './reset.css'
import './font.css'
import './index.css'
import { AppProps } from 'next/app'
import CreativeCommons from '../src/assets/CreativeCommons'
import { useRouter } from 'next/router'
import { getSafeLocale } from '../constants'
import { useT } from '../src/components/Message'

const WebApp = ({ Component, pageProps }: AppProps) => {
  const {
    query: { locale: queryLocale },
  } = useRouter()
  const currentLocale = getSafeLocale(queryLocale)
  const t = useT(currentLocale)

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
      </Head>
      <Component {...pageProps} />
      <footer className='page-footer'>
        <div className='u-center'>
          <CreativeCommons />
          <p
            className='text-meta'
            dangerouslySetInnerHTML={{
              __html: t('footer/cc'),
            }}
          ></p>
        </div>
      </footer>
    </>
  )
}

export default WebApp
