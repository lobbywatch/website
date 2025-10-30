import React from 'react'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllLobbyGroups } from 'lib/api/queries/lobbyGroups'
import { useSafeRouter, withStaticPropsContext } from 'lib/next'
import { Schema } from 'effect'
import { Locale, MappedLobbyGroup } from 'lib/types'
import { InferGetStaticPropsType } from 'next'

const LobbyGroups = ({
  lobbyGroups,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    query: { locale },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale }))

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => (
          <div className='u-center-container'>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('menu/lobbygroups'),
                description: t('lobbygroups/meta/description', {
                  count: lobbyGroups.length,
                }),
              })}
            />
            <h1 className='u-center-text'>
              <Message id='menu/lobbygroups' locale={locale} />
            </h1>
            <ListView locale={locale} items={lobbyGroups} />
          </div>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  lobbyGroups: Array<MappedLobbyGroup>
}>()(Schema.Struct({ locale: Locale }), async ({ params }) => {
  const lobbyGroups = await getAllLobbyGroups(params)
  return { props: { lobbyGroups } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default LobbyGroups
