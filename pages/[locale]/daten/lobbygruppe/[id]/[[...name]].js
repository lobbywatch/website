import React from 'react'

import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags, { GooglePreview } from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { A, Meta } from 'src/components/Styled'
import { DEBUG_INFORMATION, DRUPAL_BASE_URL } from 'constants'
import { createGetStaticProps } from 'lib/createGetStaticProps'
import { getLobbyGroup } from 'lib/api/queries/lobbyGroups'

const CONNECTION_WEIGHTS = {
  Parliamentarian: 0.1,
  Organisation: 1000,
}

const LobbyGroup = ({ data }) => {
  const {
    query: { locale, id },
    isFallback,
  } = useRouter()

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
          const { lobbyGroup } = data
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
  dataFetcher: getLobbyGroup,
  getVariables: ({ params: { id, locale } }) => ({
    id,
    locale,
  }),
  getCustomStaticProps: ({ data }) => {
    if (!data.lobbyGroup) {
      return {
        notFound: true,
      }
    } else {
      return { props: { data } }
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
