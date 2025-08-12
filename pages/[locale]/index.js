import { useRouter } from 'next/router'
import Cover from 'src/components/Frame/Cover'
import Frame from 'src/components/Frame'
import { useT } from 'src/components/Message'
import MetaTags from 'src/components/MetaTags'

import { CDN_FRONTEND_BASE_URL, getSafeLocale } from '../../constants'

const Page = () => {
  const router = useRouter()
  const locale = getSafeLocale(router.query.locale)

  const t = useT(locale)

  /* eslint-disable react/no-unescaped-entities */
  return (
    <Frame>
      <MetaTags
        locale={locale}
        title={''}
        description={t('index/meta/description')}
        image={`${CDN_FRONTEND_BASE_URL}/static/social/index.png`}
      />
      <Cover locale={locale} localeLinks={[]} menuItems={[]} />
    </Frame>
  )
}

export default Page
