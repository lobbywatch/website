import React from 'react'
import Message from 'src/components/Message'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllBranchen } from 'src/api/queries/branchen'
import type { InferGetStaticPropsType } from 'src/vendor/next'
import { useLocale, withStaticPropsContext } from 'src/vendor/next'
import { Schema } from 'effect'
import type { MappedBranch } from 'src/domain'
import { Locale } from 'src/domain'

const Branchs = ({
  branchen,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const locale = useLocale()
  return (
    <Frame>
      <div className='u-center-container'>
        <MetaTags
          locale={locale}
          fromT={(t) => ({
            title: t('menu/branchs'),
            description: t('branchs/meta/description', {
              count: branchen.length,
            }),
          })}
        />
        <h1 className='u-center-text'>
          <Message id='menu/branchs' locale={locale} />
        </h1>
        <ListView locale={locale} items={branchen} />
      </div>
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  branchen: Array<MappedBranch>
}>()(Schema.Struct({ locale: Locale }), async ({ params: { locale } }) => {
  const branchen = await getAllBranchen(locale)
  return { props: { branchen } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Branchs
