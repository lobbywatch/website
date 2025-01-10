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
import { getGuest } from 'lib/api/queries/guests'

const Guest = ({ data }) => {
  const {
    query: { locale, id },
    isFallback,
  } = useRouter()

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
          const { guest } = data
          const { __typename, updated, published, name } = guest
          const rawId = id.replace(`${__typename}-`, '')
          const path = `/${locale}/daten/zutrittsberechtigter/${rawId}/${name}`
          return (
            <div>
              <MetaTags locale={locale} data={guest} />
              <Center>
                <DetailHead locale={locale} data={guest} />
              </Center>
              <Connections
                origin={__typename}
                locale={locale}
                potency
                updated={updated}
                published={published}
                data={guest.connections}
                maxGroups={7}
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
                  <GooglePreview data={guest} path={path} />
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
  dataFetcher: getGuest,
  getCustomStaticProps: async ({ data }) => {
    if (!data.guest) {
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

export default Guest
