import React from 'react'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags, { GooglePreview } from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { A, Meta } from 'src/components/Styled'
import { DEBUG_INFORMATION, DRUPAL_BASE_URL } from '../../../../../constants'
import { getGuest } from 'lib/api/queries/guests'
import { useSafeRouter, withStaticPropsContext } from '../../../../../lib/next'
import { GuestId, Locale, MappedGuest } from '../../../../../lib/types'
import { Schema } from 'effect'
import { InferGetStaticPropsType } from 'next'

const Guest = (guest: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    query: { locale, id },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale, id: GuestId }))

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
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
                data={guest.connections ?? []}
                maxGroups={7}
                connectionWeight={() => 1}
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
                  <GooglePreview locale={locale} data={guest} path={path} />
                </Center>
              )}
            </div>
          )
        }}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<MappedGuest>()(
  Schema.Struct({ locale: Locale, id: GuestId }),
  async ({ params }) => {
    const props = await getGuest(params)
    return props ? { props } : { notFound: true }
  },
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Guest
