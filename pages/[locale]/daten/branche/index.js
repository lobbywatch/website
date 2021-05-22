import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import BlockRegion from 'src/components/BlockRegion'

import { createGetStaticProps } from 'lib/apolloClientSchemaLink'

const branchsQuery = gql`
  query branchs($locale: Locale!) {
    branchs(locale: $locale) {
      __typename
      id
      name
      commissions {
        name
      }
    }
  }
`

const Branchs = () => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
  const { loading, error, data } = useQuery(branchsQuery, {
    variables: {
      locale,
    },
  })

  return (
    <Frame>
      <Loader
        loading={loading || isFallback}
        error={error}
        render={() => (
          <Center>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('menu/branchs'),
                description: t('branchs/meta/description', {
                  count: data.branchs.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='menu/branchs' locale={locale} />
              </H1>
            </TextCenter>
            <ListView locale={locale} items={data.branchs} />
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
  pageQuery: branchsQuery,
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Branchs
