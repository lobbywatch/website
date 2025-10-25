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
import { getBranche } from 'lib/api/queries/branchen'

const CONNECTION_WEIGHTS = {
  LobbyGroup: 1000,
  Organisation: 0,
}

const Branch = ({ data }) => {
  const {
    query: { locale, id },
    isFallback,
  } = useRouter()

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
          const { branche } = data
          const { __typename, name } = branche
          const rawId = id.replace(`${__typename}-`, '')
          const path = `/${locale}/daten/branch/${rawId}/${name}`
          return (
            <div>
              <MetaTags locale={locale} data={branche} />
              <Center>
                <DetailHead locale={locale} data={branche} />
              </Center>
              <Connections
                origin={__typename}
                locale={locale}
                directness={1}
                data={branche.connections}
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
                  <GooglePreview data={branche} path={path} />
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
  dataFetcher: getBranche,
  getCustomStaticProps: ({ data }) => {
    if (!data.branche) {
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

export default Branch
