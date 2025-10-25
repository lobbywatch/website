import React from 'react'
import { useRouter } from 'next/router'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { getAllBranchen } from 'lib/api/queries/branchen'

const Branchs = ({ data }) => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
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
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  dataFetcher: getAllBranchen,
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Branchs
