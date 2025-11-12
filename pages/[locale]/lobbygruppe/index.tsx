import React from 'react'
import Message from 'src/components/Message'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllLobbyGroups } from 'src/api/queries/lobbyGroups'
import type { InferGetStaticPropsType } from 'src/vendor/next'
import { useLocale, withStaticPropsContext } from 'src/vendor/next'
import { Schema } from 'effect'
import type { MappedLobbyGroup } from 'src/domain'
import { Locale } from 'src/domain'

const LobbyGroups = ({
  lobbyGroups,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const locale = useLocale()

  return (
    <Frame>
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
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  lobbyGroups: Array<MappedLobbyGroup>
}>()(Schema.Struct({ locale: Locale }), async ({ params: { locale } }) => {
  const lobbyGroups = await getAllLobbyGroups(locale)
  return { props: { lobbyGroups } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default LobbyGroups
