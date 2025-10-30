import React from 'react'

import Loader from 'src/components/Loader'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { getOrganisation } from 'lib/api/queries/organisations'
import { useSafeRouter, withStaticPropsContext } from 'lib/next'
import { Locale, MappedOrganisation, OrganisationId } from 'lib/types'
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
    query: { locale },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale }))

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => (
          <div>
            <MetaTags locale={locale} data={organisation} />
            <div className='u-center-container'>
              <DetailHead locale={locale} data={organisation} />
            </div>
            <Connections
              origin={organisation.__typename}
              locale={locale}
              data={organisation.connections ?? []}
              groupByDestination
              connectionWeight={(connection) =>
                CONNECTION_WEIGHTS[connection.to.__typename]
              }
            />
          </div>
        )}
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
