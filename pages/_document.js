import Document, { Html, Head, Main, NextScript } from 'next/document'
import { renderStatic } from 'glamor/server'

import { LW_BLUE_LIGHT, WHITE } from '../src/theme'
import { GA_TRACKING_ID, PUBLIC_BASE_URL } from '../constants'

import 'glamor/reset'

const fontFaces =
  "@font-face{font-family:Roboto;font-style:normal;font-weight:300;src:local('Roboto Light'),local('Roboto-Light'),url(/static/fonts/roboto-v16-latin-300.woff2) format('woff2'),url(/static/fonts/roboto-v16-latin-300.woff) format('woff');font-display:swap}@font-face{font-family:Roboto;font-style:normal;font-weight:400;src:local('Roboto'),local('Roboto-Regular'),url(/static/fonts/roboto-v16-latin-regular.woff2) format('woff2'),url(/static/fonts/roboto-v16-latin-regular.woff) format('woff');font-display:swap}@font-face{font-family:Roboto;font-style:normal;font-weight:500;src:local('Roboto Medium'),local('Roboto-Medium'),url(/static/fonts/roboto-v16-latin-500.woff2) format('woff2'),url(/static/fonts/roboto-v16-latin-500.woff) format('woff');font-display:swap}@font-face{font-family:Roboto;font-style:normal;font-weight:700;src:local('Roboto Bold'),local('Roboto-Bold'),url(/static/fonts/roboto-v16-latin-700.woff2) format('woff2'),url(/static/fonts/roboto-v16-latin-700.woff) format('woff');font-display:swap}"

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage, query: { locale } }) {
    const page = renderPage()
    const styles = renderStatic(() => page.html)

    return {
      ...page,
      ...styles,
      locale,
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
          <style dangerouslySetInnerHTML={{ __html: fontFaces }} />
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
