import Document, {Head, Main, NextScript} from 'next/document'
import {LW_BLUE_LIGHT, WHITE} from '../src/theme'

import {renderStatic} from 'glamor/server'

import 'glamor/reset'

const fontFaces = `@font-face{font-family:Roboto;font-style:normal;font-weight:300;src:local('Roboto Light'),local('Roboto-Light'),url(/static/fonts/roboto-v16-latin-300.woff2) format('woff2'),url(/static/fonts/roboto-v16-latin-300.woff) format('woff')}@font-face{font-family:Roboto;font-style:normal;font-weight:400;src:local('Roboto'),local('Roboto-Regular'),url(/static/fonts/roboto-v16-latin-regular.woff2) format('woff2'),url(/static/fonts/roboto-v16-latin-regular.woff) format('woff')}@font-face{font-family:Roboto;font-style:normal;font-weight:500;src:local('Roboto Medium'),local('Roboto-Medium'),url(/static/fonts/roboto-v16-latin-500.woff2) format('woff2'),url(/static/fonts/roboto-v16-latin-500.woff) format('woff')}@font-face{font-family:Roboto;font-style:normal;font-weight:700;src:local('Roboto Bold'),local('Roboto-Bold'),url(/static/fonts/roboto-v16-latin-700.woff2) format('woff2'),url(/static/fonts/roboto-v16-latin-700.woff) format('woff')}`

export default class MyDocument extends Document {
  static async getInitialProps ({renderPage}) {
    const page = renderPage()
    const styles = renderStatic(() => page.html)
    return {
      ...page,
      ...styles,
      env: require('../constants')
    }
  }
  constructor (props) {
    super(props)
    const {__NEXT_DATA__, env} = props
    if (env) {
      __NEXT_DATA__.env = env
    }
  }
  render () {
    const {css} = this.props
    return (
      <html>
        <Head>
          <meta name='viewport' content='width=device-width,initial-scale=1' />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          <style dangerouslySetInnerHTML={{ __html: fontFaces }} />
          {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
          <link rel='apple-touch-icon' sizes='180x180' href='/static/apple-touch-icon.png' />
          <link rel='icon' type='image/png' href='/static/favicon-32x32.png' sizes='32x32' />
          <link rel='icon' type='image/png' href='/static/favicon-16x16.png' sizes='16x16' />
          <link rel='manifest' href='/static/manifest.json' />
          <link rel='mask-icon' href='/static/safari-pinned-tab.svg' color={LW_BLUE_LIGHT} />
          <link rel='shortcut icon' href='/static/favicon.ico' />
          <meta name='msapplication-config' content='/static/browserconfig.xml' />
          <meta name='theme-color' content={WHITE} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
