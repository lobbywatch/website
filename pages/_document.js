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
    const {nextStyles, css} = this.props
    return (
      <html>
        <Head>
          <title>Lobbywatch Rooster</title>
          {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
          {nextStyles || null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
