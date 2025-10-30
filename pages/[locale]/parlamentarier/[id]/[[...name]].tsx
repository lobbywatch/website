import React from 'react'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { getParliamentarian } from 'lib/api/queries/parliamentarians'
import { useSafeRouter, withStaticPropsContext } from 'lib/next'
import { Locale, MappedParliamentarian, ParliamentarianId } from 'lib/types'
import { Schema } from 'effect'
import { InferGetStaticPropsType } from 'next'

const Parliamentarian = (
  parliamentarian: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const {
    query: { locale, id },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale, id: ParliamentarianId }))
  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => {
          const { __typename, updated, published } = parliamentarian
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
                data={parliamentarian.connections ?? []}
                maxGroups={7}
                updated={updated}
                published={published}
                intermediate={(connection) =>
                  connection.vias != null && connection.vias.length > 0
                    ? connection.vias[0].to.id
                    : ''
                }
                intermediates={parliamentarian.guests}
                connectionWeight={() => 1}
              />
            </div>
          )
        }}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<MappedParliamentarian>()(
  Schema.Struct({ locale: Locale, id: ParliamentarianId }),
  async ({ params }) => {
    const props = await getParliamentarian(params)
    return props ? { props } : { notFound: true }
  },
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Parliamentarian
