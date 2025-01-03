import React from 'react'
import { useRouter } from 'next/router'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import BlockRegion from 'src/components/BlockRegion'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { useBranchen } from 'lib/api/queries/useBranchen'

const Branchs = () => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
  const { data, error, isLoading } = useBranchen({ locale })

  return (
    <Frame>
      <Loader
        loading={isLoading || isFallback}
        error={error}
        render={() => (
          <Center>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('menu/branchs'),
                description: t('branchs/meta/description', {
                  count: data.branchen.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='menu/branchs' locale={locale} />
              </H1>
            </TextCenter>
            <ListView locale={locale} items={data.branchen} />
            <BlockRegion
              locale={locale}
              region='rooster_branchs'
              style={{ paddingTop: 50 }}
            />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  // pageQuery: branchsQuery,
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Branchs
