import Document, {Head, Main, NextScript} from 'next/document'

import {renderStatic} from 'glamor/server'

import 'glamor/reset'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    let props
    const {css} = renderStatic(() => {
      props = Document.getInitialProps(ctx)
      return props.html
    })
    return {...props, css}
  }

  render () {
    const {css} = this.props
    return (
      <html>
        <Head>
          <meta name='viewport' content='width=device-width,initial-scale=1' />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
