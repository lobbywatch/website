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
import { getParliamentarian } from 'lib/api/queries/parliamentarians'

const Parliamentarian = ({ data }) => {
  const {
    query: { locale, id },
    isFallback,
  } = useRouter()
  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
          const { parliamentarian } = data
          const { __typename, name, updated, published } = parliamentarian
          const rawId = id.replace(`${__typename}-`, '')
          const path = `/${locale}/daten/parlamentarier/${rawId}/${name}`
          return (
            <div>
              <MetaTags locale={locale} data={parliamentarian} />
              <Center>
                <DetailHead locale={locale} data={parliamentarian} />
              </Center>
              <Connections
                origin={__typename}
                locale={locale}
                potency
                data={parliamentarian.connections}
                maxGroups={7}
                updated={updated}
                published={published}
                intermediate={(connection) =>
                  connection.vias.length > 0 ? connection.vias[0].to.id : ''
                }
                intermediates={parliamentarian.guests}
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
                    data={parliamentarian}
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

export const getStaticProps = createGetStaticProps({
  dataFetcher: getParliamentarian,
  getCustomStaticProps: ({ data }) => {
    if (!data.parliamentarian) {
      return {
        notFound: true,
      }
    } else {
      return {
        props: {
          data,
        },
      }
    }
  },
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Parliamentarian
