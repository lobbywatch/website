import React from 'react'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags, { GooglePreview } from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { A, Meta } from 'src/components/Styled'
import { DEBUG_INFORMATION, DRUPAL_BASE_URL } from '../../../../../constants'
import { getOrganisation } from 'lib/api/queries/organisations'
import { useSafeRouter, withStaticPropsContext } from '../../../../../lib/next'
import {
  Locale,
  MappedOrganisation,
  OrganisationId,
} from '../../../../../lib/types'
import { Schema } from 'effect'
import { InferGetStaticPropsType } from 'next'

const CONNECTION_WEIGHTS = {
  Branch: 1,
  Guest: 1,
  LobbyGroup: 1,
  Organisation: 0.1,
  Parliamentarian: 1000,
}

const Org = (organisation: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    query: { locale, id },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale, id: OrganisationId }))

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
          const { __typename, name } = organisation
          const rawId = id.replace(`${__typename}-`, '')
          const path = `/${locale}/daten/organisation/${rawId}/${name}`
          return (
            <div>
              <MetaTags locale={locale} data={organisation} />
              <Center>
                <DetailHead locale={locale} data={organisation} />
              </Center>
              <Connections
                origin={__typename}
                locale={locale}
                data={organisation.connections ?? []}
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
                  <GooglePreview
                    locale={locale}
                    data={organisation}
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

export const getStaticProps = withStaticPropsContext<MappedOrganisation>()(
  Schema.Struct({ locale: Locale, id: OrganisationId }),
  async ({ params }) => {
    const props = await getOrganisation(params)
    return props ? { props } : { notFound: true }
  },
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Org
