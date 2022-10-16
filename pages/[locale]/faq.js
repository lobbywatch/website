import { useRouter } from 'next/router'
import { Interaction, RawHtml } from '@project-r/styleguide'

import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'

import FaqList, { H2 } from 'src/components/Faq/List'
import { withInitialProps } from 'lib/apolloClient'

import { PUBLIC_BASE_URL, getSafeLocale } from '../../constants'
import { useT } from 'src/components/Message'

const Page = () => {
  const t = useT()
  const { query } = useRouter()
  const locale = getSafeLocale(query.locale)
  
  return (
    <Frame>
      <MetaTags
        pageTitle={t('faq/pageTitle')}
        title={t('faq/pageTitle')}
        description={t('faq/metaDescription')}
        url={`${PUBLIC_BASE_URL}/${locale}/faq`}
      />
      <Center>
        <H2>{t('faq/before/title')}</H2>
        <RawHtml
          type={Interaction.P}
          dangerouslySetInnerHTML={{
            __html: t('faq/before/support/text'),
          }}
        />
        <br />
        <FaqList locale={locale} />
      </Center>
    </Frame>
  )
}

export default withInitialProps(Page)
