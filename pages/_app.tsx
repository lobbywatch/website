import Head from 'next/head'

import './reset.css'
import './font.css'
import './index.css'
import { AppProps } from 'next/app'
import { metaStyle } from '../src/components/Styled'
import CreativeCommons from '../src/assets/CreativeCommons'
import { css } from 'glamor'
import { mediaM } from '../src/theme'
import { useRouter } from 'next/router'
import { getSafeLocale } from '../constants'
import { useT } from '../src/components/Message'

const ccTextStyle = css({
  ...metaStyle,
  textAlign: 'center',
  [mediaM]: {
    // @ts-expect-error Can't be indexed by object
    ...metaStyle[mediaM],
    margin: 0,
    textAlign: 'left',
    paddingLeft: 30,
  },
})

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
            style={ccTextStyle}
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
