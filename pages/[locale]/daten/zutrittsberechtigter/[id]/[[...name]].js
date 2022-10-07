import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags, { GooglePreview } from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { Meta, A } from 'src/components/Styled'
import { itemPath } from 'src/utils/routes'
import { DRUPAL_BASE_URL, DEBUG_INFORMATION } from 'constants'

import { createGetStaticProps } from 'lib/createGetStaticProps'

const guestQuery = gql`
  query getGuest($locale: Locale!, $id: ID!) {
    getGuest(locale: $locale, id: $id) {
      __typename
      id
      updated
      published
      name
      occupation
      gender
      wikipedia_url
      wikidata_url
      twitter_name
      twitter_url
      facebook_url
      linkedin_url
      parliamentarian {
        __typename
        id
        name
        wikidata_url
        parlament_biografie_url
      }
      function
      connections {
        group
        potency
        function
        description
        compensations {
          year
          money
          description
        }
        to {
          __typename
          ... on Organisation {
            id
            name
            uid
            wikidata_url
          }
        }
      }
    }
  }
`

const Guest = () => {
  const {
    query: { locale, id },
    isFallback,
  } = useRouter()
  const { loading, error, data } = useQuery(guestQuery, {
    variables: {
      locale,
      id,
    },
  })

  return (
    <Frame>
      <Loader
        loading={loading || isFallback}
        error={error}
        render={() => {
          const { getGuest: guest } = data
          const { __typename, updated, published, name } = guest
          const rawId = id.replace(`${__typename}-`, '')
          const path = `/${locale}/daten/zutrittsberechtigter/${rawId}/${name}`
          return (
            <div>
              <MetaTags locale={locale} data={guest} />
              <Center>
                <DetailHead locale={locale} data={guest} />
              </Center>
              <Connections
                origin={__typename}
                locale={locale}
                potency
                updated={updated}
                published={published}
                data={guest.connections}
                maxGroups={7}
              />
              {DEBUG_INFORMATION && (
                <Center>
                  <Meta>
                    Original Profil:{' '}
                    <A target='_blank' href={`${DRUPAL_BASE_URL}${path}`}>
                      Staging
                    </A>
                    {', '}
                    <A target='_blank' href={`https://lobbywatch.ch${path}`}>
                      Live
                    </A>
                  </Meta>
                  <GooglePreview data={guest} path={path} />
                </Center>
              )}
            </div>
          )
        }}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  pageQuery: guestQuery,
  getVariables: ({ params: { id } }) => ({
    id,
  }),
  getCustomStaticProps: async (
    { data },
    { params: { locale, name } },
    apolloClient
  ) => {
    if (name && data.getGuest?.name !== name[0]) {
      // name mismatch, try to find exact name match
      // - because ids recently changed we prioritize name over id match
      const allGuests = await apolloClient.query({
        query: gql`
          query guestNames($locale: Locale!) {
            guests(locale: $locale) {
              __typename
              id
              name
            }
          }
        `,
        variables: {
          locale,
        },
      })
      const exactMatch = allGuests.data.guests.find((g) => g.name === name[0])
      if (exactMatch) {
        return {
          redirect: {
            destination: itemPath(exactMatch, locale),
          },
        }
      }
    }
    if (!data.getGuest) {
      return {
        notFound: true,
      }
    }
  },
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Guest
