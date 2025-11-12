import React from 'react'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { getLobbyGroup } from 'src/api/queries/lobbyGroups'
import type { MappedLobbyGroup, MappedObjectType } from 'src/domain'
import { LobbyGroupId, Locale } from 'src/domain'
import {
  type InferGetStaticPropsType,
  useLocale,
  withStaticPropsContext,
} from 'src/vendor/next'
import { Schema } from 'effect'

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
  const locale = useLocale()
  const { __typename } = lobbyGroup
  return (
    <Frame>
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
