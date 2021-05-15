import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags, { GooglePreview } from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { A, Meta } from 'src/components/Styled'
import { DRUPAL_BASE_URL, DEBUG_INFORMATION } from 'constants'

import { createGetStaticProps } from 'lib/apolloClientSchemaLink'

const orgQuery = gql`
  query getOrganisation($locale: Locale!, $id: ID!) {
    getOrganisation(locale: $locale, id: $id) {
      __typename
      id
      updated
      published
      name
      legalForm
      location
      postalCode
      countryIso2
      description
      uid
      website
      wikipedia_url
      wikidata_url
      twitter_name
      twitter_url
      lobbyGroups {
        id
        name
      }
      connections {
        group
        potency
        function
        compensations {
          year
          money
          description
        }
        to {
          __typename
          ... on Parliamentarian {
            id
            name
            wikidata_url
            parlament_biografie_url
          }
          ... on Organisation {
            id
            name
          }
        }
        vias {
          __typename
          to {
            ... on Guest {
              id
              name
            }
          }
        }
      }
    }
  }
`

const CONNECTION_WEIGHTS = {
  Parliamentarian: 1000,
  Organisation: 0.1,
}

const Org = () => {
  const {
    query: { locale, id },
    isFallback,
  } = useRouter()
  const { loading, error, data } = useQuery(orgQuery, {
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
          const { getOrganisation: organisation } = data
          const { __typename, name } = organisation
          const rawId = id.replace(`${__typename}-`, '')
          const path = `/${locale}/daten/organisation/${rawId}/${name}`
          return (
            <div>
              <MetaTags locale={locale} data={organisation} />
              <Center>
                <DetailHead locale={locale} data={organisation} />
              </Center>
              <Connections
                locale={locale}
                data={organisation.connections}
                groupByDestination
                connectionWeight={(connection) =>
                  CONNECTION_WEIGHTS[connection.to.__typename]
                }
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
                  <GooglePreview data={organisation} path={path} />
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
  pageQuery: orgQuery,
  getVariables: ({ params: { id } }) => ({
    id,
  }),
  getCustomStaticProps: ({ data }) => {
    if (!data.getOrganisation) {
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

export default Org
