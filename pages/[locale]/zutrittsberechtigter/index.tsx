import React from 'react'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllGuests } from 'lib/api/queries/guests'
import { useSafeRouter, withStaticPropsContext } from 'src/vendor/next'
import { Locale, MappedGuest } from 'src/domain'
import { Schema } from 'effect'
import { InferGetStaticPropsType } from 'next'

const Guests = ({ guests }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    query: { locale },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale }))

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => (
          <div className='u-center-container'>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('guests/meta/title'),
                description: t('guests/meta/description', {
                  count: guests.length,
                }),
              })}
            />
            <h1 className='u-center-text'>
              <Message id='guests/meta/title' locale={locale} />
            </h1>
            <ListView locale={locale} items={guests} />
          </div>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  guests: Array<MappedGuest>
}>()(Schema.Struct({ locale: Locale }), async ({ params: { locale } }) => {
  const guests = await getAllGuests(locale)
  return { props: { guests } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Guests
