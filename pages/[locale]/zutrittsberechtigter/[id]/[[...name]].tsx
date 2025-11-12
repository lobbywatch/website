import React from 'react'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import { getGuest } from 'src/api/queries/guests'
import type { InferGetStaticPropsType } from 'src/vendor/next'
import { useLocale, withStaticPropsContext } from 'src/vendor/next'
import type { MappedGuest } from 'src/domain'
import { GuestId, Locale } from 'src/domain'
import { Schema } from 'effect'

const Guest = (guest: InferGetStaticPropsType<typeof getStaticProps>) => {
  const locale = useLocale()
  const { __typename, updated, published } = guest

  return (
    <Frame>
      {' '}
      <div>
        <MetaTags locale={locale} data={guest} />
        <div className='u-center-container'>
          <DetailHead locale={locale} data={guest} />
        </div>
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
      </div>
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
