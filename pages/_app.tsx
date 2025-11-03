import Head from 'next/head'

import './reset.css'
import './font.css'
import './index.css'
import { AppProps } from 'next/app'
import CreativeCommons from '../src/assets/CreativeCommons'
import { useT } from '../src/components/Message'
import { useSafeRouter } from '../src/vendor/next'
import { Schema } from 'effect'
import { Locale } from '../src/domain'

const WebApp = ({ Component, pageProps }: AppProps) => {
  const {
    query: { locale },
  } = useSafeRouter(
    Schema.Struct({
      locale: Schema.optionalWith(Locale, { default: () => 'de' }),
    }),
  )
  const t = useT(locale)

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
