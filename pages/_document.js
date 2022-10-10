import Document, { Html, Head, Main, NextScript } from 'next/document'
import { renderStaticOptimized } from 'glamor/server'
import { fontFaces } from '@project-r/styleguide'

import { LW_BLUE_LIGHT, WHITE } from '../src/theme'
import { GA_TRACKING_ID, PUBLIC_BASE_URL, getSafeLocale } from '../constants'

import 'glamor/reset'

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage, query: { locale } }) {
    const page = renderPage()
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
    const { css, locale } = this.props
    const motivationComment = `/*
🤔 You look like a curious person.
💁 That's good, we need people like you!
👉 Join us, ${PUBLIC_BASE_URL || ''}/de/seite/mitarbeiten
*/`
    return (
      <Html lang={locale} dir='ltr'>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: motivationComment }} />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <style dangerouslySetInnerHTML={{ __html: fontFaces() }} />
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
          <link
            rel='mask-icon'
            href='/static/safari-pinned-tab.svg'
            color={LW_BLUE_LIGHT}
          />
          <link rel='shortcut icon' href='/favicon.ico' />
          <meta
            name='msapplication-config'
            content='/static/browserconfig.xml'
          />
          <meta name='theme-color' content={WHITE} />
        </Head>
        <body>
          <Main />
          <NextScript />
          {!!GA_TRACKING_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', '${GA_TRACKING_ID}', 'auto');
ga('set', 'anonymizeIp', true);
          `,
              }}
            />
          )}
        </body>
      </Html>
    )
  }
}
