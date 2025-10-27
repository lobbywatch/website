import React from 'react'
import { useRouter } from 'next/router'
import Frame from 'src/components/Frame'
import { useT } from 'src/components/Message'

import MetaTags from 'src/components/MetaTags'
import { getSafeLocale, PUBLIC_BASE_URL } from '../../constants'

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
    </Frame>
  )
}

export default Page
