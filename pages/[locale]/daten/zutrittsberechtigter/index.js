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

import { createGetStaticProps } from 'lib/createGetStaticProps'

const guestsQuery = gql`
  query guests($locale: Locale!) {
    guests(locale: $locale) {
      __typename
      id
      name
      firstName
      lastName
      function
    }
  }
`

const Guests = () => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
  const { loading, error, data } = useQuery(guestsQuery, {
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
                title: t('guests/meta/title'),
                description: t('guests/meta/description', {
                  count: data.guests.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='guests/meta/title' locale={locale} />
              </H1>
            </TextCenter>
            <ListView locale={locale} items={data.guests} />
            <BlockRegion
              locale={locale}
              region='rooster_guests'
              style={{ paddingTop: 50 }}
            />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  pageQuery: guestsQuery,
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Guests
