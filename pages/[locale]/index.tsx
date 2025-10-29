import React from 'react'
import { useRouter } from 'next/router'
import Frame, { Center } from 'src/components/Frame'
import Message, { useT } from 'src/components/Message'

import MetaTags from 'src/components/MetaTags'
import { getSafeLocale, PUBLIC_BASE_URL } from '../../constants'
import { H1, H2, P } from '../../src/components/Styled'

const Page = () => {
  const router = useRouter()
  const locale = getSafeLocale(router.query.locale)

  const t = useT(locale)

  return (
    <Frame>
      <MetaTags
        locale={locale}
        title={''}
        description={t('index/meta/description')}
        image={`${PUBLIC_BASE_URL}/static/social/index.png`}
      />
      <Center>
        <H1>
          <Message id={'claim'} locale={locale} />
        </H1>

        <P>
          <Message id={'index/meta/description'} locale={locale} />
        </P>

        <H2>
          <Message id={'purpose/research/title'} locale={locale} />
        </H2>
        <P>
          <Message id={'purpose/research/text'} locale={locale} />
        </P>

        <H2>
          <Message id={'purpose/independence/title'} locale={locale} />
        </H2>
        <P>
          <Message id={'purpose/independence/text'} locale={locale} />
        </P>

        <H2>
          <Message id={'purpose/nonprofit/title'} locale={locale} />
        </H2>
        <P>
          <Message id={'purpose/nonprofit/text'} locale={locale} />
        </P>
      </Center>
    </Frame>
  )
}

export default Page
