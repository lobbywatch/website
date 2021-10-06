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

const branchQuery = gql`
  query getBranch($locale: Locale!, $id: ID!) {
    getBranch(locale: $locale, id: $id) {
      __typename
      id
      updated
      published
      name
      description
      wikipedia_url
      wikidata_url
      commissions {
        name
        abbr
      }
      connections {
        group
        function
        description
        to {
          __typename
          ... on LobbyGroup {
            id
            name
          }
          ... on Parliamentarian {
            id
            name
          }
        }
        vias {
          __typename
          to {
            ... on LobbyGroup {
              id
              name
            }
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
  LobbyGroup: 1000,
  Organisation: 0,
}

const Branch = () => {
  const {
    query: { locale, id },
    isFallback,
  } = useRouter()
  const { loading, error, data } = useQuery(branchQuery, {
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
          const { getBranch: branch } = data
          const { __typename, name } = branch
          const rawId = id.replace(`${__typename}-`, '')
          const path = `/${locale}/daten/branch/${rawId}/${name}`
          return (
            <div>
              <MetaTags locale={locale} data={branch} />
              <Center>
                <DetailHead locale={locale} data={branch} />
              </Center>
              <Connections
                origin={__typename}
                locale={locale}
                directness={1}
                data={branch.connections}
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
                  <GooglePreview data={branch} path={path} />
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
  pageQuery: branchQuery,
  getVariables: ({ params: { id } }) => ({
    id,
  }),
  getCustomStaticProps: ({ data }) => {
    if (!data.getBranch) {
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

export default Branch
