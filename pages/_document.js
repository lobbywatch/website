import Document, { Html, Head, Main, NextScript } from 'next/document'
import { renderStaticOptimized } from 'glamor/server'

import { WHITE } from '../src/theme'
import { getSafeLocale } from '../constants'

import 'glamor/reset'

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage, query: { locale } }) {
    const page = await renderPage()
    const styles = renderStaticOptimized(() => page.html)

    return {
      ...page,
      ...styles,
      env: require('../constants'),
      locale: getSafeLocale(locale),
    }
  }
  constructor(props) {
    super(props)
    const { __NEXT_DATA__, env } = props
    if (env) {
      __NEXT_DATA__.env = this.props.env
    }
  }
  render() {
    const {
      css,
      locale,
      env: { MATOMO_URL_BASE, MATOMO_SITE_ID, PUBLIC_BASE_URL },
    } = this.props
    const motivationComment = `/*
🤔 You look like a curious person.
💁 That's good, we need people like you!
👉 Join us, ${PUBLIC_BASE_URL || ''}/de/seite/mitarbeiten
*/`
    const matomo = !!MATOMO_URL_BASE && !!MATOMO_SITE_ID
    return (
      <Html lang={locale} dir='ltr'>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: motivationComment }} />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />

          {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            href='/static/favicon-32x32.png'
            sizes='32x32'
          />
          <link
            rel='icon'
            type='image/png'
            href='/static/favicon-16x16.png'
            sizes='16x16'
          />
          <link rel='manifest' href='/static/manifest.json' />
          <link rel='shortcut icon' href='/favicon.ico' />
          <meta
            name='msapplication-config'
            content='/static/browserconfig.xml'
          />
          <meta name='theme-color' content={WHITE} />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{ __html: `var _paq = _paq || [];` }}
          />
          <Main />
          <NextScript />
          {matomo && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
            _paq.push(['enableLinkTracking']);
            ${
              PUBLIC_BASE_URL?.indexOf('https') === 0
                ? "_paq.push(['setSecureCookie', true]);"
                : ''
            }
            (function() {
              _paq.push(['setTrackerUrl', '${MATOMO_URL_BASE}/matomo.php']);
              _paq.push(['setSiteId', '${MATOMO_SITE_ID}']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.type='text/javascript'; g.async=true; g.defer=true; g.src='${MATOMO_URL_BASE}/matomo.js'; s.parentNode.insertBefore(g,s);
            })();`,
              }}
            />
          )}
          {matomo && (
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${MATOMO_URL_BASE}/matomo.php?idsite=${MATOMO_SITE_ID}&rec=1`}
                style={{ border: 0, position: 'fixed', left: -1 }}
                alt=''
              />
            </noscript>
          )}
        </body>
      </Html>
    )
  }
}
