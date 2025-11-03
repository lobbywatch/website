import React from 'react'

import Loader from 'src/components/Loader'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { getLobbyGroup } from 'lib/api/queries/lobbyGroups'
import {
  LobbyGroupId,
  Locale,
  MappedLobbyGroup,
  MappedObjectType,
} from 'src/domain'
import { InferGetStaticPropsType } from 'next'
import { Schema } from 'effect'
import { useSafeRouter, withStaticPropsContext } from 'src/vendor/next'

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
    query: { locale },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale }))

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
          const { __typename } = lobbyGroup
          return (
            <div>
              <MetaTags locale={locale} data={lobbyGroup} />
              <div className='u-center-container'>
                <DetailHead locale={locale} data={lobbyGroup} />
              </div>
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
