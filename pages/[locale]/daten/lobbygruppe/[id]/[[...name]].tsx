import React from 'react'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags, { GooglePreview } from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { A, Meta } from 'src/components/Styled'
import { DEBUG_INFORMATION, DRUPAL_BASE_URL } from '../../../../../constants'
import { getLobbyGroup } from 'lib/api/queries/lobbyGroups'
import {
  LobbyGroupId,
  Locale,
  MappedLobbyGroup,
  MappedObjectType,
} from 'lib/types'
import { InferGetStaticPropsType } from 'next'
import { Schema } from 'effect'
import { useSafeRouter, withStaticPropsContext } from 'lib/next'

const CONNECTION_WEIGHTS: Record<MappedObjectType, number> = {
  Branch: 1,
  Guest: 1,
  LobbyGroup: 1,
  Organisation: 1000,
  Parliamentarian: 0.1,
}

const LobbyGroup = (
  lobbyGroup: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const {
    query: { locale, id },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale, id: LobbyGroupId }))

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
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
                data={lobbyGroup.connections ?? []}
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
                  <GooglePreview
                    locale={locale}
                    data={lobbyGroup}
                    path={path}
                  />
                </Center>
              )}
            </div>
          )
        }}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<MappedLobbyGroup>()(
  Schema.Struct({ locale: Locale, id: LobbyGroupId }),
  async ({ params }) => {
    const props = await getLobbyGroup(params)
    return props ? { props } : { notFound: true }
  },
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default LobbyGroup
