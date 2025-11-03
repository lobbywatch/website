import React from 'react'

import Loader from 'src/components/Loader'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { getBranche } from 'src/api/queries/branchen'
import { useSafeRouter, withStaticPropsContext } from 'src/vendor/next'
import { Schema } from 'effect'
import { BranchId, Locale, MappedBranch } from 'src/domain'
import { InferGetStaticPropsType } from 'next'

const CONNECTION_WEIGHTS = {
  Branch: 1,
  Guest: 1,
  LobbyGroup: 1000,
  Organisation: 0,
  Parliamentarian: 1,
}

const Branch = (branche: InferGetStaticPropsType<typeof getStaticProps>) => {
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
            <MetaTags locale={locale} data={branche} />
            <div className='u-center-container'>
              <DetailHead locale={locale} data={branche} />
            </div>
            <Connections
              origin={branche.__typename}
              locale={locale}
              directness={1}
              data={branche.connections ?? []}
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

export const getStaticProps = withStaticPropsContext<MappedBranch>()(
  Schema.Struct({ locale: Locale, id: BranchId }),
  async ({ params }) => {
    const props = await getBranche(params)
    return props ? { props } : { notFound: true }
  },
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Branch
