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
import { lobbyGroupDetailFragment } from 'lib/fragments'
import { createGetStaticProps } from 'lib/createGetStaticProps'

const lobbyGroupQuery = gql`
  query getLobbyGroup($locale: Locale!, $id: ID!) {
    getLobbyGroup(locale: $locale, id: $id) {
      ...LobbyGroupDetailFragment
    }
  }
  ${lobbyGroupDetailFragment}
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
                origin={__typename}
                locale={locale}
                directness={1}
                data={lobbyGroup.connections}
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
