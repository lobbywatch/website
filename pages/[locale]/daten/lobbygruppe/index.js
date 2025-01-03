import React from 'react'
import { useRouter } from 'next/router'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import BlockRegion from 'src/components/BlockRegion'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { useLobbyGroups } from 'lib/api/queries/useLobbyGroups'

const LobbyGroups = () => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
  const { data, error, isLoading } = useLobbyGroups({ locale })

  return (
    <Frame>
      <Loader
        loading={isLoading || isFallback}
        error={error}
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
            <BlockRegion
              locale={locale}
              region='rooster_lobbygroups'
              style={{ paddingTop: 50 }}
            />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default LobbyGroups
