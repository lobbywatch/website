import React from 'react'
import { useRouter } from 'next/router'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { getAllLobbyGroups } from 'lib/api/queries/lobbyGroups'

const LobbyGroups = ({ data }) => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => (
          <Center>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('menu/lobbygroups'),
                description: t('lobbygroups/meta/description', {
                  count: data.lobbyGroups.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='menu/lobbygroups' locale={locale} />
              </H1>
            </TextCenter>
            <ListView locale={locale} items={data.lobbyGroups} />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  dataFetcher: getAllLobbyGroups,
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default LobbyGroups
