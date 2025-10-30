import React from 'react'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllBranchen } from 'lib/api/queries/branchen'
import { useSafeRouter, withStaticPropsContext } from 'lib/next'
import { Schema } from 'effect'
import { Locale, MappedBranch } from 'lib/types'
import { InferGetStaticPropsType } from 'next'

const Branchs = ({
  branchen,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    query: { locale },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale }))
  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => (
          <Center>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('menu/branchs'),
                description: t('branchs/meta/description', {
                  count: branchen.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='menu/branchs' locale={locale} />
              </H1>
            </TextCenter>
            <ListView locale={locale} items={branchen} />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  branchen: Array<MappedBranch>
}>()(Schema.Struct({ locale: Locale }), async ({ params }) => {
  const branchen = await getAllBranchen(params)
  return { props: { branchen } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Branchs
