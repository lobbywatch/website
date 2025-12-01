import React from 'react'
import Frame from 'src/components/Frame'
import Message, { useT } from 'src/components/Message'

import MetaTags from 'src/components/MetaTags'
import { PUBLIC_BASE_URL } from '../../constants'
import { useLocale } from '../../src/vendor/next'
import ReactDOMServer from 'react-dom/server'

const Page = () => {
  const locale = useLocale()

  const t = useT(locale)

  return (
    <Frame>
      <MetaTags
        locale={locale}
        title={''}
        description={t('index/meta/description')}
        image={`${PUBLIC_BASE_URL}/static/social/index.png`}
      />
      <div className='u-center-container'>
        <h1>
          <Message id={'claim'} locale={locale} />
        </h1>

        <p>
          <Message id={'index/meta/description'} locale={locale} />
        </p>

        <h2>
          <Message id={'purpose/research/title'} locale={locale} />
        </h2>
        <p>
          <Message id={'purpose/research/text'} locale={locale} />
        </p>

        <h2>
          <Message id={'purpose/independence/title'} locale={locale} />
        </h2>
        <p>
          <Message id={'purpose/independence/text'} locale={locale} />
        </p>

        <h2>
          <Message id={'purpose/nonprofit/title'} locale={locale} />
        </h2>
        <p>
          <Message id={'purpose/nonprofit/text'} locale={locale} />
        </p>
      </div>
    </Frame>
  )
}

export const render = () => {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <Page />
    </React.StrictMode>,
  )
}

export default Page
