import React from 'react'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { getParliamentarian } from 'src/api/queries/parliamentarians'
import type { InferGetStaticPropsType } from 'src/vendor/next'
import { useLocale, withStaticPropsContext } from 'src/vendor/next'
import type { MappedParliamentarian } from 'src/domain'
import { Locale, ParliamentarianId } from 'src/domain'
import { Schema } from 'effect'

const Parliamentarian = (
  parliamentarian: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const locale = useLocale()
  const { __typename, updated, published } = parliamentarian
  return (
    <Frame>
      <div>
        <MetaTags locale={locale} data={parliamentarian} />
        <div className='u-center-container'>
          <DetailHead locale={locale} data={parliamentarian} />
        </div>
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
      </div>{' '}
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
