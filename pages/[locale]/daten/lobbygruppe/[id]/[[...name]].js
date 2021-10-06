import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags, { GooglePreview } from 'src/components/MetaTags'
import Connections, { hoverValues } from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { A, Meta } from 'src/components/Styled'
import { DRUPAL_BASE_URL, DEBUG_INFORMATION } from 'constants'

import { createGetStaticProps } from 'lib/apolloClientSchemaLink'

const lobbyGroupQuery = gql`
  query getLobbyGroup($locale: Locale!, $id: ID!) {
    getLobbyGroup(locale: $locale, id: $id) {
      __typename
      id
      updated
      published
      name
      branch {
        id
        name
      }
      description
      commissions {
        name
        abbr
      }
      wikipedia_url
      wikidata_url
      connections {
        group
        function
        description
        to {
          __typename
          ... on Organisation {
            id
            name
            uid
            wikidata_url
          }
          ... on Parliamentarian {
            id
            name
            wikidata_url
            parlament_biografie_url
          }
        }
        vias {
          __typename
          to {
            ... on Organisation {
              id
              name
            }
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
  Parliamentarian: 0.1,
  Organisation: 1000,
}

const LobbyGroup = () => {
  const {
    query: { locale, id },
    isFallback,
  } = useRouter()
  const { loading, error, data } = useQuery(lobbyGroupQuery, {
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
          const { getLobbyGroup: lobbyGroup } = data
          const { __typename, name } = lobbyGroup
          const rawId = id.replace(`${__typename}-`, '')
          const path = `/${locale}/daten/lobbygruppe/${rawId}/${name}`
          return (
            <div>
              <MetaTags locale={locale} data={lobbyGroup} />
              <Center>
                <DetailHead locale={locale} data={lobbyGroup} />
              </Center>
              <Connections
                locale={locale}
                directness={1}
                data={lobbyGroup.connections}
                groupByDestination
                connectionWeight={(connection) =>
                  CONNECTION_WEIGHTS[connection.to.__typename]
                }
                hoverValues={[
                  [
                    'connections/context/occupation',
                    ({ data: { connection } }) =>
                      connection.to?.__typename === 'Parliamentarian' &&
                      connection.vias.length === 0 &&
                      connection.function,
                  ],
                  ...hoverValues.filter(
                    ([key]) => key !== 'connections/context/function'
                  ),
                ]}
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
                  <GooglePreview data={lobbyGroup} path={path} />
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
  pageQuery: lobbyGroupQuery,
  getVariables: ({ params: { id } }) => ({
    id,
  }),
  getCustomStaticProps: ({ data }) => {
    if (!data.getLobbyGroup) {
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

export default LobbyGroup
